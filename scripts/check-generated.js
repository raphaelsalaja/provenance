import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createArtifacts } from "../src/artifacts.js";
import { loadDocument } from "../src/load-document.js";
import { validateDocument } from "../src/validate-document.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, "examples/minimal/provenance.yaml");
const output = resolve(root, "examples/minimal/generated");
const document = await loadDocument(input);
const errors = validateDocument(document);

if (errors.length) throw new Error(errors.join("\n"));

const differences = [];
for (const [name, expected] of createArtifacts(document)) {
  let actual;
  try {
    actual = await readFile(join(output, name), "utf8");
  } catch {
    differences.push(`${name} is missing`);
    continue;
  }
  if (actual !== expected) differences.push(`${name} is out of date`);
}

if (differences.length) {
  throw new Error(
    `${differences.join("\n")}\nRun pnpm generate:examples and commit the results.`,
  );
}

console.log("Generated example artifacts are up to date.");
