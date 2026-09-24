# Provenance

[![CI](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml/badge.svg)](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml)

Provenance is an open proposal for recording the sources that shape software and
the specific decisions or artifacts they influence.

Software projects already have dependency graphs. Provenance adds an influence
graph for research, documentation, design references, datasets, code, media,
models, standards, and other source material.

> **Status:** v0.1 proposal. The format is usable and tested, but it is not an
> industry standard. Feedback and independent implementations are welcome.

## Start here

- [Read the specification](packages/provenance/spec/v0.1.md)
- [Inspect the JSON Schema](packages/provenance/schema/provenance.schema.json)
- [Use the CLI and GitHub Action](packages/provenance/README.md)
- [See generic examples](packages/provenance/examples)

Validate a repository with the reusable Action:

```yaml
- uses: actions/checkout@v6
- uses: raphaelsalaja/provenance@v0.1.2
  with:
    file: provenance.yaml
```

Or use the CLI without installing it globally:

```bash
pnpm dlx provenance-specification@0.1.2 check provenance.yaml
```

## Repository

This is a pnpm and Turborepo monorepo:

```text
apps/website/               Provenance website
packages/provenance/        specification, schema, CLI, tests, and examples
action.yml                  reusable Provenance Check action
provenance.yaml             this repository's own influence record
```

Use Node.js 24 and pnpm 11.27.0:

```bash
pnpm install
pnpm check
pnpm build
pnpm dev
```

## Contributing and licensing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [GOVERNANCE.md](GOVERNANCE.md).
Reference implementation code and the JSON Schema are MIT licensed. The
specification, documentation, and examples are licensed under CC BY 4.0. See
[LICENSE](LICENSE) and [LICENSES](LICENSES).
