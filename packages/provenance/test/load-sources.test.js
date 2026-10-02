import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { loadDocument } from "../src/load-document.js";
import { validateDocument } from "../src/validate-document.js";

test("loads a company and its nested product", async () => {
  const document = await loadDocument("examples/entities/.provenance");

  assert.deepEqual(validateDocument(document), []);
  assert.equal(document.project.name, "Example Project");

  const vercel = document.sources.find((source) => source.id === "vercel");
  const nextjs = document.sources.find((source) => source.id === "nextjs");
  assert.equal(vercel.type, "company");
  assert.equal(vercel.title, "Vercel");
  assert.deepEqual(vercel.terms, { status: "unknown" });
  assert.deepEqual(vercel.links, [
    "https://nextjs.org/docs",
    "https://turbo.build/repo/docs",
  ]);
  assert.equal(nextjs.type, "product");
  assert.equal(nextjs.parent, "vercel");
  assert.match(vercel.notes, /hosting platform/);

  const influence = document.relationships.find(
    (relationship) => relationship.id === "website-framework",
  );
  assert.equal(influence.source, "vercel");
  assert.deepEqual(influence.evidence, [
    {
      type: "file",
      locator: "docs/provenance/migration/legacy-influences.md",
    },
  ]);
});

test("rejects a source directory that is not a kind", async () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-sources-"));
  mkdirSync(join(directory, "sources/misc"), { recursive: true });
  writeFileSync(
    join(directory, "project.yaml"),
    'schemaVersion: "0.1"\nname: Example\n',
  );

  await assert.rejects(
    loadDocument(directory),
    /misc is not a source kind directory/,
  );
});

test("rejects a source id that does not match its folder", async () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-sources-"));
  const entity = join(directory, "sources/companies/vercel");
  mkdirSync(entity, { recursive: true });
  writeFileSync(
    join(directory, "project.yaml"),
    'schemaVersion: "0.1"\nname: Example\n',
  );
  writeFileSync(
    join(entity, "source.md"),
    "---\nid: other\nurl: https://vercel.com\nterms: unknown\ninfluenced: []\n---\n\n# Vercel\n",
  );

  await assert.rejects(
    loadDocument(directory),
    /source\.md id must be vercel/,
  );
});
