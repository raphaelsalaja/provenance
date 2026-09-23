import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { exportProvJsonLd } from "./export-prov-jsonld.js";
import { renderMarkdown } from "./render-markdown.js";

export function createArtifacts(document) {
  const markdown = renderMarkdown(document);
  return new Map([
    ["REFERENCES.md", `${markdown.references.trimEnd()}\n`],
    ["INFLUENCES.md", `${markdown.influences.trimEnd()}\n`],
    [
      "provenance.prov.jsonld",
      `${JSON.stringify(exportProvJsonLd(document), null, 2)}\n`,
    ],
  ]);
}

export async function writeArtifacts(document, outputDirectory) {
  const directory = resolve(outputDirectory);
  await mkdir(directory, { recursive: true });
  for (const [name, content] of createArtifacts(document)) {
    await writeFile(join(directory, name), content);
  }
  return directory;
}
