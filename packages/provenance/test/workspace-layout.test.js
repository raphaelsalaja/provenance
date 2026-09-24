import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadDocument } from "../src/load-document.js";
import { validateDocument } from "../src/validate-document.js";

const repositoryRoot = new URL("../../../", import.meta.url);

test("the root action invokes the workspace CLI", async () => {
  const action = await readFile(new URL("action.yml", repositoryRoot), "utf8");

  assert.match(action, /--filter provenance-specification/);
  assert.match(action, /packages\/provenance\/src\/cli\.js/);
});

test("the repository provenance record validates from the package", async () => {
  const document = await loadDocument(
    fileURLToPath(new URL("provenance.yaml", repositoryRoot)),
  );

  assert.deepEqual(validateDocument(document), []);
});
