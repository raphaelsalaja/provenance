<img src="apps/website/app/icon.svg" alt="" width="48" height="48">

# Provenance

[![CI](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml/badge.svg)](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml)
[![skills.sh](https://skills.sh/b/raphaelsalaja/provenance)](https://skills.sh/raphaelsalaja/provenance/provenance)

Provenance is an open format for recording the sources that shape software and
the decisions, files, tests, or releases they influence.

A dependency graph records what software needs to run. Provenance adds an
influence graph for research, documentation, designs, datasets, standards,
code, media, models, and other source material.

> [!NOTE]
> Provenance v0.1 is a tested proposal, not an industry standard. Feedback and
> independent implementations are welcome.

## Set up Provenance

Run one command from the root of your repository:

```bash
npx @web-kits/provenance
```

The setup creates `.provenance/`, installs instructions for supported coding
agents, adds the validation workflow, and checks the result.

To add only the agent skill, run:

```bash
npx skills@latest add raphaelsalaja/provenance --skill provenance
```

The skill initializes Provenance the first time that a material source affects
the work.

## What a record contains

The `.provenance/` folder lives beside the work. Each thing or person is a
folder under `.provenance/sources/`. A company, person, product, or standard
has its own `source.md`: who they are, links to the pages that mattered, and
one sentence for each influence. A product that needs its own note nests under
its parent, such as `sources/companies/vercel/nextjs/source.md`.

```text
.provenance/
├── project.yaml
└── sources/
    ├── companies/
    │   └── vercel/
    │       └── source.md
    └── people/
        └── ada-lovelace/
            └── source.md
```

`project.yaml` holds the project name, repository, and version. Unknown
information stays unknown. A citation records influence but does not grant
permission to copy, adapt, or redistribute a source.

A single `.provenance/provenance.yaml` file remains valid when `sources/` is
absent:

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

Setup adds Provenance Check to a GitHub Actions workflow:

```yaml
- uses: actions/checkout@v6
- uses: raphaelsalaja/provenance@v0.2.1
  with:
    file: .provenance/provenance.yaml
```

To run the CLI from this repository:

```bash
pnpm install
node packages/provenance/src/cli.js check
```

The CLI is available as
[`@web-kits/provenance`](https://www.npmjs.com/package/@web-kits/provenance).
Release notes are available in the
[v0.2.1 GitHub release](https://github.com/raphaelsalaja/provenance/releases/tag/v0.2.1).

## Generate public views

Generate the source catalog, influence index, and W3C PROV JSON-LD export:

```bash
node packages/provenance/src/cli.js generate
```

The command writes:

```text
.provenance/
├── project.yaml
├── sources/
│   └── companies/
│       └── vercel/
│           └── source.md
└── output/
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
skills/provenance/           public agent skill
action.yml                  reusable Provenance Check action
.provenance/                source record and generated output
```

Use Node.js 24 and pnpm 11.27.0. Run `pnpm check`, `pnpm test`, and
`pnpm build` before opening a change. See [CONTRIBUTING.md](CONTRIBUTING.md)
and [GOVERNANCE.md](GOVERNANCE.md) for project policy.
