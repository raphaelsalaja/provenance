import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadDocument } from "../src/load-document.js";
import { validateDocument } from "../src/validate-document.js";

const repositoryRoot = new URL("../../../", import.meta.url);

test("the root action invokes the workspace CLI", async () => {
  const action = await readFile(new URL("action.yml", repositoryRoot), "utf8");

  assert.match(action, /--filter @web-kits\/provenance/);
  assert.match(action, /packages\/provenance\/src\/cli\.js/);
});

test("the repository provenance record validates from the package", async () => {
  const document = await loadDocument(
    fileURLToPath(new URL(".provenance/provenance.yaml", repositoryRoot)),
  );

  assert.deepEqual(validateDocument(document), []);
});

test("the npm template matches the public skill", async () => {
  for (const file of ["SKILL.md", "references/record-format.md"]) {
    const publicSkill = await readFile(
      new URL(`skills/provenance/${file}`, repositoryRoot),
      "utf8",
    );
    const packagedSkill = await readFile(
      new URL(
        `packages/provenance/templates/skill/provenance/${file}`,
        repositoryRoot,
      ),
      "utf8",
    );

    assert.equal(packagedSkill, publicSkill, file);
  }
});
