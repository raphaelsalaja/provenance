import { readdir, readFile, stat } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

const KIND_DIRECTORIES = new Map([
  ["companies", "company"],
  ["people", "person"],
  ["products", "product"],
  ["standards", "standard"],
]);

const SOURCE_FIELDS = [
  "creators",
  "publisher",
  "datePublished",
  "dateAccessed",
  "archiveUrl",
  "revision",
  "integrity",
  "notes",
  "extensions",
];

const RELATIONSHIP_FIELDS = [
  "confidence",
  "recordedAt",
  "recordedBy",
  "notes",
  "extensions",
];

export async function loadDocument(file = ".provenance/provenance.yaml") {
  const path = resolve(file);
  const info = await stat(path);
  if (info.isDirectory()) return loadEntityRecord(path);
  return loadFile(path);
}

async function loadFile(path) {
  const source = await readFile(path, "utf8");

  try {
    if (extname(path).toLowerCase() === ".json") return JSON.parse(source);
    return parseYaml(source);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse ${path}: ${reason}`);
  }
}

async function loadEntityRecord(directory) {
  const projectPath = join(directory, "project.yaml");
  const sourcesRoot = join(directory, "sources");
  const projectFile = await loadFile(projectPath);
  const entities = [];

  let entries;
  try {
    entries = await readdir(sourcesRoot, { withFileTypes: true });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read ${sourcesRoot}: ${reason}`);
  }

  for (const entry of entries.sort(byName)) {
    const kindPath = join(sourcesRoot, entry.name);
    const type = KIND_DIRECTORIES.get(entry.name);
    if (!entry.isDirectory() || !type) {
      throw new Error(`${kindPath} is not a source kind directory`);
    }
    for (const name of (await readdir(kindPath)).sort(compareText)) {
      await collectEntity(join(kindPath, name), type, null, entities);
    }
  }

  const sources = [];
  const relationships = [];
  for (const entity of entities) {
    sources.push(entity.source);
    relationships.push(...entity.relationships);
  }

  const document = {
    schemaVersion: projectFile.schemaVersion,
    project: projectFields(projectFile),
    sources,
    relationships,
  };
  if (projectFile.extensions) document.extensions = projectFile.extensions;
  return document;
}

function projectFields(projectFile) {
  if (projectFile.project && typeof projectFile.project === "object") {
    return projectFile.project;
  }
  const project = {};
  for (const key of ["name", "description", "repository", "version"]) {
    if (projectFile[key] !== undefined) project[key] = projectFile[key];
  }
  return project;
}

async function collectEntity(directory, type, parentId, entities) {
  const info = await stat(directory);
  if (!info.isDirectory()) {
    throw new Error(`${directory} must be an entity directory`);
  }

  const sourcePath = join(directory, "source.yaml");
  const data = await parseSourceFile(sourcePath);
  const id = basename(directory);
  if (data.id !== id) {
    throw new Error(`${sourcePath} id must be ${id}`);
  }
  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new Error(`${sourcePath} must include a title`);
  }

  const source = {
    id,
    type,
    title: data.title.trim(),
    terms: normalizeTerms(data.terms),
  };
  if (data.url !== undefined) source.url = data.url;
  if (parentId) source.parent = parentId;
  for (const field of SOURCE_FIELDS) {
    if (data[field] !== undefined) source[field] = data[field];
  }
  if (data.links?.length) source.links = data.links;

  entities.push({
    source,
    relationships: (data.influenced ?? []).map((entry) =>
      relationshipFromInfluence(entry, id),
    ),
  });

  const children = await readdir(directory, { withFileTypes: true });
  for (const child of children.sort(byName)) {
    if (child.name === "source.yaml") continue;
    if (!child.isDirectory()) {
      throw new Error(
        `${join(directory, child.name)} is not part of an entity folder`,
      );
    }
    await collectEntity(join(directory, child.name), "product", id, entities);
  }
}

async function parseSourceFile(path) {
  let text;
  try {
    text = await readFile(path, "utf8");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not read ${path}: ${reason}`);
  }

  let data;
  try {
    data = parseYaml(text);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse ${path}: ${reason}`);
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${path} must be a mapping`);
  }

  return data;
}

function normalizeTerms(terms) {
  if (typeof terms === "string") return { status: terms };
  return terms;
}

function relationshipFromInfluence(entry, sourceId) {
  const relationship = {
    id: entry.id,
    source: sourceId,
    type: entry.type,
    targets: entry.targets,
    contribution: entry.contribution,
  };
  for (const field of RELATIONSHIP_FIELDS) {
    if (entry[field] !== undefined) relationship[field] = entry[field];
  }
  if (entry.evidence !== undefined) {
    relationship.evidence = normalizeEvidence(entry.evidence);
  }
  return relationship;
}

function normalizeEvidence(evidence) {
  if (typeof evidence === "string") {
    return [{ type: "file", locator: evidence }];
  }
  return evidence;
}

function byName(left, right) {
  return compareText(left.name, right.name);
}

function compareText(left, right) {
  return left.localeCompare(right, "en");
}
