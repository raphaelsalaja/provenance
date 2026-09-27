import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(packageRoot, "../..");
const check = process.argv.includes("--check");
const files = ["SKILL.md", "references/record-format.md"];
const differences = [];

for (const file of files) {
  const source = resolve(repositoryRoot, "skills/provenance", file);
  const target = resolve(packageRoot, "templates/skill/provenance", file);
  const expected = await readFile(source, "utf8");

  if (check) {
    let actual;
    try {
      actual = await readFile(target, "utf8");
    } catch {
      differences.push(`${file} is missing from the npm template`);
      continue;
    }
    if (actual !== expected) differences.push(`${file} is out of date`);
    continue;
  }

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, expected);
}

if (differences.length) {
  throw new Error(
    `${differences.join("\n")}\nRun pnpm --filter @web-kits/provenance sync:skill and commit the results.`,
  );
}

console.log(check ? "The packaged skill is up to date." : "Synchronized the packaged skill.");
