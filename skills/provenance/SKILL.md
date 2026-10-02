---
name: provenance
description: Use when an external source materially influences code, documentation, tests, design, or a project decision.
---

# Provenance

Keep the Provenance record current as you work. Material influence includes
inspiration that changes the result, even when no source material is copied.

## Record an influence

1. If neither `.provenance/sources/` nor `.provenance/provenance.yaml` exists,
   run `npx @web-kits/provenance` from the project root.
2. Read `.provenance/skills/provenance/references/record-format.md` when it
   exists. Otherwise, read `references/record-format.md` beside this skill.
3. Record the thing or the person. If that entity already has a folder, add
   the new page to its `links`. Create a folder only for a new entity.
4. When the effect is new, add one `influenced` entry. Write the contribution
   as one sentence, and point `evidence` at a longer note.
5. If the project has `provenance.yaml` and no `sources/` directory, add the
   source and relationship in that file instead of starting a second record.
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
