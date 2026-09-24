import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";

const schema = JSON.parse(
  readFileSync(new URL("../schema/provenance.schema.json", import.meta.url), "utf8"),
);

const ajv = new Ajv2020({ allErrors: true, strict: true });

ajv.addFormat("uri", {
  type: "string",
  validate(value) {
    try {
      const url = new URL(value);
      return Boolean(url.protocol);
    } catch {
      return false;
    }
  },
});

ajv.addFormat("date", {
  type: "string",
  validate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().startsWith(value);
  },
});

const validateSchema = ajv.compile(schema);

function formatSchemaError(error) {
  const location = error.instancePath || "/";
  if (error.keyword === "required") {
    return `${location} must include ${error.params.missingProperty}`;
  }
  return `${location} ${error.message ?? "is invalid"}`;
}

function duplicates(items, key) {
  const seen = new Set();
  const repeated = new Set();
  for (const item of items) {
    const value = item?.[key];
    if (typeof value !== "string") continue;
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated].sort();
}

export function validateDocument(document) {
  const errors = [];

  if (!validateSchema(document)) {
    errors.push(...(validateSchema.errors ?? []).map(formatSchemaError));
    return errors;
  }

  for (const id of duplicates(document.sources, "id")) {
    errors.push(`/sources contains duplicate id ${id}`);
  }
  for (const id of duplicates(document.relationships, "id")) {
    errors.push(`/relationships contains duplicate id ${id}`);
  }

  const sourceIds = new Set(document.sources.map((source) => source.id));
  const referencedSources = new Set();
  for (const relationship of document.relationships) {
    referencedSources.add(relationship.source);
    if (!sourceIds.has(relationship.source)) {
      errors.push(
        `/relationships/${relationship.id} references missing source ${relationship.source}`,
      );
    }
  }

  for (const source of document.sources) {
    if (!referencedSources.has(source.id)) {
      errors.push(`/sources/${source.id} is not used by a relationship`);
    }
  }

  return errors;
}
