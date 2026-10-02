# Provenance Record Format

A source is the thing or the person that influenced the work: a company, a
person, a product, or a standard. Pages from that entity are links on its
`source.md`, not separate sources.

```text
.provenance/
  project.yaml
  sources/
    companies/
      vercel/
        source.md
        nextjs/
          source.md
    people/
      ada-lovelace/
        source.md
```

`project.yaml` names the project. Each entity folder is named with its id and
contains `source.md`. A product that needs its own note nests under its parent.
The nested file is still one entity.

```markdown
---
id: vercel
url: https://vercel.com
terms: unknown
links:
  - https://nextjs.org/docs
influenced:
  - id: website-framework
    type: consulted
    targets:
      - apps/website
    contribution: Next.js documentation informed the site structure.
---

# Vercel

Vercel publishes Next.js and the hosting platform used for the site.
```

## Relationship Types

| Type | Use when the source... |
| --- | --- |
| `consulted` | supplied background but did not change the work. |
| `inspired` | changed the direction without copied material. |
| `adapted` | supplied a pattern or material that the project changed. |
| `copied` | appears substantially or verbatim in the project. |
| `bundled` | ships with the project. |
| `verified` | supports a claim, behavior, or test expectation. |

Use stable lowercase kebab-case IDs. Keep target paths relative to the project
root. Leave unknown terms as `terms: unknown`. Add `recordedAt`, `confidence`,
or evidence only when the value is known.

A repository that already uses `.provenance/provenance.yaml` and has no
`sources/` directory keeps that single file. The same fields apply there.
