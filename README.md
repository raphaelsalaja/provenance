<img src="apps/website/app/icon.svg" alt="" width="48" height="48">

# Provenance

[![CI](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml/badge.svg)](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml)

Provenance is an open format for recording the sources that shape software and
the decisions, files, tests, or releases they influence.

A dependency graph records what software needs to run. Provenance adds an
influence graph for research, documentation, designs, datasets, standards,
code, media, models, and other source material.

> [!NOTE]
> Provenance v0.1 is a tested proposal, not an industry standard. Feedback and
> independent implementations are welcome.

## What a record contains

A `provenance.yaml` file lives beside the work. It contains:

- retrievable sources with known authorship, dates, revisions, and terms;
- explicit relationships such as `consulted`, `inspired`, or `verified`;
- stable targets such as repository paths, decisions, tests, and releases;
- a short account of what each source contributed.

Unknown information stays unknown. A citation records influence but does not
grant permission to copy, adapt, or redistribute a source.

```yaml
schemaVersion: "0.1"
project:
  name: Example Project
sources:
  - id: architecture-guide
    type: documentation
    title: Example Architecture Guide
    url: https://example.com/architecture-guide
    terms:
      status: unknown
relationships:
  - id: module-boundary
    source: architecture-guide
    type: adapted
    targets:
      - docs/architecture.md
    contribution: Informed the boundary between domain logic and external adapters.
```

## Validate a record

Add Provenance Check to a GitHub Actions workflow:

```yaml
- uses: actions/checkout@v6
- uses: raphaelsalaja/provenance@v0.1.2
  with:
    file: provenance.yaml
```

To run the CLI from this repository:

```bash
pnpm install
node packages/provenance/src/cli.js check provenance.yaml
```

The npm package is not published yet. The v0.1.2 CLI is available in the
[GitHub release](https://github.com/raphaelsalaja/provenance/releases/tag/v0.1.2).

## Generate public views

Generate the source catalog, influence index, and W3C PROV JSON-LD export:

```bash
node packages/provenance/src/cli.js generate provenance.yaml --output-dir generated
```

The command writes:

```text
generated/
├── REFERENCES.md
├── INFLUENCES.md
└── provenance.prov.jsonld
```

## Relationship vocabulary

| Type | Meaning |
| --- | --- |
| `consulted` | Considered as background without claiming adoption. |
| `inspired` | Affected direction without copying code, text, or assets. |
| `adapted` | Transformed a source pattern or material for the target. |
| `copied` | Reproduced source material substantially or verbatim. |
| `bundled` | Distributed the source material with the project. |
| `verified` | Supplied evidence for a claim, behavior, or test expectation. |

The [v0.1 specification](packages/provenance/spec/v0.1.md) defines the
relationship semantics and conformance levels. The
[JSON Schema](packages/provenance/schema/provenance.schema.json) defines the
machine-readable structure.

## How Provenance fits

Provenance has one job: record how sources influenced software. It complements:

- [CITATION.cff](https://citation-file-format.github.io/) for citing the project;
- [REUSE](https://reuse.software/spec/) and
  [SPDX](https://spdx.dev/use/specifications/) for licensing and composition;
- [W3C PROV](https://www.w3.org/TR/prov-overview/) for general provenance data;
- build attestations for release production and verification.

## Repository map

```text
apps/website/               public website
packages/provenance/        specification, schema, CLI, tests, and examples
action.yml                  reusable Provenance Check action
provenance.yaml             this repository's influence record
```

Use Node.js 24 and pnpm 11.27.0. Run `pnpm check`, `pnpm test`, and
`pnpm build` before opening a change. See [CONTRIBUTING.md](CONTRIBUTING.md)
and [GOVERNANCE.md](GOVERNANCE.md) for project policy.
