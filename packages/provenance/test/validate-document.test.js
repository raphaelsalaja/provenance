import assert from "node:assert/strict";
import { test } from "node:test";
import { loadDocument } from "../src/load-document.js";
import { validateDocument } from "../src/validate-document.js";

test("accepts the minimal example", async () => {
  const document = await loadDocument("examples/minimal/provenance.yaml");
  assert.deepEqual(validateDocument(document), []);
});

test("accepts every normative relationship type", async () => {
  const document = await loadDocument("examples/relationships/provenance.yaml");
  assert.deepEqual(validateDocument(document), []);
});

test("requires relationship targets and a contribution", () => {
  const errors = validateDocument({
    schemaVersion: "0.1",
    project: { name: "Example" },
    sources: [],
    relationships: [{ id: "invalid", source: "missing" }],
  });
  assert.ok(errors.some((error) => error.includes("targets")));
  assert.ok(errors.some((error) => error.includes("contribution")));
});

test("rejects duplicate ids, missing sources, and unused sources", () => {
  const source = {
    id: "example-source",
    type: "webpage",
    title: "Example Source",
    url: "https://example.com/source",
    terms: { status: "unknown" },
  };
  const document = {
    schemaVersion: "0.1",
    project: { name: "Example" },
    sources: [source, source, { ...source, id: "unused-source" }],
    relationships: [
      {
        id: "missing-source",
        source: "absent-source",
        type: "consulted",
        targets: ["README.md"],
        contribution: "Provided background context.",
      },
    ],
  };

  const errors = validateDocument(document);
  assert.ok(errors.some((error) => error.includes("duplicate id example-source")));
  assert.ok(errors.some((error) => error.includes("missing source absent-source")));
  assert.ok(errors.some((error) => error.includes("unused-source is not used")));
});

test("rejects invalid calendar dates", () => {
  const document = {
    schemaVersion: "0.1",
    project: { name: "Example" },
    sources: [
      {
        id: "example-source",
        type: "webpage",
        title: "Example Source",
        url: "https://example.com/source",
        dateAccessed: "2026-02-31",
        terms: { status: "unknown" },
      },
    ],
    relationships: [
      {
        id: "example-relationship",
        source: "example-source",
        type: "consulted",
        targets: ["README.md"],
        contribution: "Provided background context.",
      },
    ],
  };

  assert.ok(validateDocument(document).some((error) => error.includes("format")));
});
