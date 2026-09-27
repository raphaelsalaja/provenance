---
name: provenance
description: Use when an external source materially influences code, documentation, tests, design, or a project decision.
---

# Provenance

Keep `.provenance/provenance.yaml` current as you work. Material influence
includes inspiration that changes the result, even when no source material is
copied.

## Record an influence

1. If `.provenance/provenance.yaml` is missing, run
   `npx @web-kits/provenance` from the project root.
2. Read `.provenance/skills/provenance/references/record-format.md` when it
   exists. Otherwise, read `references/record-format.md` beside this skill.
3. Add the source once with only metadata that you can verify.
4. Add a relationship from the source to the affected targets.
5. Describe the concrete contribution in one sentence.
6. Run `npx @web-kits/provenance check` and
   `npx @web-kits/provenance generate` before you finish.
7. Mention the recorded relationship in your final summary.

## Preserve uncertainty

- Never invent an author, date, revision, license, URL, or relationship.
- Keep unknown metadata unknown.
- Do not treat a citation as permission to copy, adapt, or redistribute work.
- Do not record private prompts, credentials, signed URLs, or confidential
  material.
- Do not claim complete capture of agent activity.

If a source did not materially affect the work, do not add it.
