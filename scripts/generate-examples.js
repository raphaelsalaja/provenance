import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeArtifacts } from "../src/artifacts.js";
import { loadDocument } from "../src/load-document.js";
import { validateDocument } from "../src/validate-document.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, "examples/minimal/provenance.yaml");
const output = resolve(root, "examples/minimal/generated");
const document = await loadDocument(input);
const errors = validateDocument(document);

if (errors.length) {
  throw new Error(errors.join("\n"));
}

await writeArtifacts(document, output);
console.log(`Generated example artifacts in ${output}.`);
