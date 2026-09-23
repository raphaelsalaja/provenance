import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

export async function loadDocument(file = "provenance.yaml") {
  const path = resolve(file);
  const source = await readFile(path, "utf8");

  try {
    if (extname(path).toLowerCase() === ".json") return JSON.parse(source);
    return parseYaml(source);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse ${path}: ${reason}`);
  }
}
