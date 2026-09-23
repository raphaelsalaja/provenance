#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { writeArtifacts } from "./artifacts.js";
import { exportProvJsonLd } from "./export-prov-jsonld.js";
import { loadDocument } from "./load-document.js";
import { validateDocument } from "./validate-document.js";

const VERSION = "0.1.0";

const help = `Provenance ${VERSION}

Usage:
  provenance check [file]
  provenance generate [file] --output-dir <directory>
  provenance export [file] --format prov-jsonld [--output <file>]
  provenance --help
  provenance --version

The default input file is provenance.yaml.
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
  return args.find((argument, index) => {
    if (argument.startsWith("--")) return false;
    if (index > 0 && args[index - 1].startsWith("--")) return false;
    return true;
  }) ?? "provenance.yaml";
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
  if (!argv.length || argv.includes("--help") || argv.includes("-h")) {
    process.stdout.write(help);
    return;
  }
  if (argv.includes("--version") || argv.includes("-v")) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  const [command, ...args] = argv;
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
      option(args, "--output-dir", "generated"),
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
