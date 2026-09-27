import assert from "node:assert/strict";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const packageDirectory = fileURLToPath(new URL("..", import.meta.url));
const cliPath = fileURLToPath(new URL("../src/cli.js", import.meta.url));

function cliFrom(cwd, ...args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
}

function cli(...args) {
  return cliFrom(packageDirectory, ...args);
}

test("check exits successfully for a valid document", () => {
  const result = cli("check", "examples/minimal/.provenance/provenance.yaml");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /is valid/);
});

test("check reports actionable validation errors", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-cli-"));
  const file = join(directory, "provenance.json");
  writeFileSync(file, JSON.stringify({ schemaVersion: "0.1" }));

  const result = cli("check", file);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must include project/);
});

test("generate writes all public artifacts", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-cli-"));
  const result = cli(
    "generate",
    "examples/minimal/.provenance/provenance.yaml",
    "--output-dir",
    directory,
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(readFileSync(join(directory, "REFERENCES.md"), "utf8"), /References/);
  assert.match(readFileSync(join(directory, "INFLUENCES.md"), "utf8"), /Influences/);
  assert.doesNotThrow(() =>
    JSON.parse(readFileSync(join(directory, "provenance.prov.jsonld"), "utf8")),
  );
});

test("generate uses the .provenance project layout by default", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-cli-"));
  const provenanceDirectory = join(directory, ".provenance");
  mkdirSync(provenanceDirectory);
  copyFileSync(
    join(
      packageDirectory,
      "examples/minimal/.provenance/provenance.yaml",
    ),
    join(provenanceDirectory, "provenance.yaml"),
  );

  const result = cliFrom(directory, "generate");

  assert.equal(result.status, 0, result.stderr);
  assert.match(
    readFileSync(join(provenanceDirectory, "output/REFERENCES.md"), "utf8"),
    /References/,
  );
});

test("running without arguments sets up Provenance for every supported agent", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-setup-"));
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify({ name: "example-project" }),
  );

  const result = cliFrom(directory);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Provenance is ready/);
  assert.match(
    readFileSync(join(directory, ".provenance/provenance.yaml"), "utf8"),
    /name: "Example Project"/,
  );
  for (const file of [
    ".provenance/skills/provenance/SKILL.md",
    ".provenance/skills/provenance/references/record-format.md",
    ".provenance/output/REFERENCES.md",
    ".provenance/output/INFLUENCES.md",
    ".provenance/output/provenance.prov.jsonld",
    ".agents/skills/provenance/SKILL.md",
    ".claude/skills/provenance/SKILL.md",
    ".cursor/rules/provenance.mdc",
    ".github/copilot-instructions.md",
    ".github/workflows/provenance.yml",
  ]) {
    assert.doesNotThrow(() => readFileSync(join(directory, file), "utf8"), file);
  }
});

test("setup preserves an existing provenance record", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-setup-"));
  const provenanceDirectory = join(directory, ".provenance");
  const record = 'schemaVersion: "0.1"\nproject:\n  name: Existing Project\nsources: []\nrelationships: []\n';
  mkdirSync(provenanceDirectory);
  writeFileSync(join(provenanceDirectory, "provenance.yaml"), record);

  const result = cliFrom(directory);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    readFileSync(join(provenanceDirectory, "provenance.yaml"), "utf8"),
    record,
  );
});

test("setup does not overwrite an existing workflow it does not manage", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-setup-"));
  const workflowDirectory = join(directory, ".github/workflows");
  const workflow = "name: Custom provenance workflow\n";
  mkdirSync(workflowDirectory, { recursive: true });
  writeFileSync(join(workflowDirectory, "provenance.yml"), workflow);

  const result = cliFrom(directory);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Skipped .github\/workflows\/provenance.yml/);
  assert.equal(
    readFileSync(join(workflowDirectory, "provenance.yml"), "utf8"),
    workflow,
  );
});

test("setup preserves existing GitHub Copilot instructions", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-setup-"));
  const githubDirectory = join(directory, ".github");
  const instructions = "Always use the project formatter.\n";
  mkdirSync(githubDirectory, { recursive: true });
  writeFileSync(
    join(githubDirectory, "copilot-instructions.md"),
    instructions,
  );

  const result = cliFrom(directory);
  const installed = readFileSync(
    join(githubDirectory, "copilot-instructions.md"),
    "utf8",
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(installed, /Always use the project formatter\./);
  assert.match(installed, /\.provenance\/skills\/provenance\/SKILL\.md/);
});

test("export writes PROV JSON-LD to a requested file", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-cli-"));
  const output = join(directory, "export.jsonld");
  const result = cli(
    "export",
    "examples/minimal/.provenance/provenance.yaml",
    "--format",
    "prov-jsonld",
    "--output",
    output,
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(readFileSync(output, "utf8"))["@context"].prov, "http://www.w3.org/ns/prov#");
});

test("help and version are available without a document", () => {
  assert.match(cli("--help").stdout, /provenance check/);
  assert.match(cli("--help").stdout, /.provenance\/provenance.yaml/);
  assert.match(cli("--help").stdout, /.provenance\/output/);
  assert.equal(cli("--version").stdout.trim(), "0.2.1");
});

test("the npm binary runs through a symlink", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-bin-"));
  const binary = join(directory, "provenance");
  symlinkSync(cliPath, binary);

  const result = spawnSync(binary, ["--version"], { encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "0.2.1");
});
