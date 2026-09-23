import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

function cli(...args) {
  return spawnSync(process.execPath, ["src/cli.js", ...args], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
}

test("check exits successfully for a valid document", () => {
  const result = cli("check", "examples/minimal/provenance.yaml");
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
    "examples/minimal/provenance.yaml",
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

test("export writes PROV JSON-LD to a requested file", () => {
  const directory = mkdtempSync(join(tmpdir(), "provenance-cli-"));
  const output = join(directory, "export.jsonld");
  const result = cli(
    "export",
    "examples/minimal/provenance.yaml",
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
  assert.equal(cli("--version").stdout.trim(), "0.1.1");
});
