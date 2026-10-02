#!/usr/bin/env node

import { existsSync, readFileSync, realpathSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeArtifacts } from "./artifacts.js";
import { exportProvJsonLd } from "./export-prov-jsonld.js";
import { loadDocument } from "./load-document.js";
import { findProjectRoot, setupProject } from "./setup.js";
import { validateDocument } from "./validate-document.js";

const VERSION = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;
const DEFAULT_INPUT_FILE = ".provenance/provenance.yaml";
const DEFAULT_SOURCES_DIRECTORY = ".provenance/sources";
const DEFAULT_OUTPUT_DIRECTORY = ".provenance/output";

const help = `Provenance ${VERSION}

Usage:
  provenance
  provenance setup
  provenance check [file]
  provenance generate [file] --output-dir <directory>
  provenance export [file] --format prov-jsonld [--output <file>]
  provenance --help
  provenance --version

The default input is ${DEFAULT_SOURCES_DIRECTORY} when that directory exists,
otherwise ${DEFAULT_INPUT_FILE}.
The default generated output directory is ${DEFAULT_OUTPUT_DIRECTORY}.
`;

function option(args, name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function inputFile(args) {
  return (
    args.find((argument, index) => {
      if (argument.startsWith("--")) return false;
      if (index > 0 && args[index - 1].startsWith("--")) return false;
      return true;
    }) ?? defaultInput()
  );
}

function defaultInput() {
  const provenance = joinProjectPath(".provenance");
  if (existsSync(join(provenance, "sources"))) return provenance;
  return join(provenance, "provenance.yaml");
}

function joinProjectPath(path) {
  return resolve(findProjectRoot(), path);
}

async function validatedDocument(file) {
  const document = await loadDocument(file);
  const errors = validateDocument(document);
  if (errors.length) {
    throw new Error(
      `Invalid provenance document ${resolve(file)}:\n${errors
        .map((error) => `- ${error}`)
        .join("\n")}`,
    );
  }
  return document;
}

async function run(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stdout.write(help);
    return;
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  const [command, ...args] = argv;

  if (!command || command === "setup" || command === "init") {
    const result = await setupProject();
    for (const path of result.created) process.stdout.write(`Created ${path}\n`);
    for (const path of result.updated) process.stdout.write(`Updated ${path}\n`);
    for (const path of result.skipped) process.stdout.write(`Skipped ${path}\n`);
    process.stdout.write(`Provenance is ready in ${result.root}.\n`);
    return;
  }

  const file = inputFile(args);

  if (command === "check") {
    await validatedDocument(file);
    process.stdout.write(`${resolve(file)} is valid.\n`);
    return;
  }

  if (command === "generate") {
    const document = await validatedDocument(file);
    const directory = await writeArtifacts(
      document,
      option(args, "--output-dir", joinProjectPath(DEFAULT_OUTPUT_DIRECTORY)),
    );
    process.stdout.write(`Generated provenance artifacts in ${directory}.\n`);
    return;
  }

  if (command === "export") {
    const format = option(args, "--format", "prov-jsonld");
    if (format !== "prov-jsonld") {
      throw new Error(`Unsupported export format: ${format}`);
    }
    const document = await validatedDocument(file);
    const content = `${JSON.stringify(exportProvJsonLd(document), null, 2)}\n`;
    const output = option(args, "--output", undefined);
    if (output) {
      await writeFile(resolve(output), content);
      process.stdout.write(`Wrote ${resolve(output)}.\n`);
    } else {
      process.stdout.write(content);
    }
    return;
  }

  throw new Error(`Unknown command: ${command}\n\n${help}`);
}

export async function main(argv = process.argv.slice(2)) {
  try {
    await run(argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === realpathSync(process.argv[1])
) {
  await main();
}
