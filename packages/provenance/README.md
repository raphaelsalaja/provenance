# Provenance

Provenance is an open proposal and reference CLI for recording the sources that
shape software and the specific decisions or artifacts they influence.

> **Status:** v0.1 proposal. The format is usable and tested, but it is not an
> industry standard.

## Quick start

Run the CLI directly with `npx`:

```bash
npx @web-kits/provenance
npx @web-kits/provenance check
npx @web-kits/provenance generate
```

To install the agent skill without running setup first:

```bash
npx skills@latest add raphaelsalaja/provenance --skill provenance
```

The skill runs setup when it first encounters a material source in an
uninitialized repository.

A minimal `.provenance/provenance.yaml` looks like this:

```yaml
schemaVersion: "0.1"
project:
  name: Example Project
sources:
  - id: example-architecture-guide
    type: documentation
    title: Example Architecture Guide
    creators:
      - name: Example Standards Group
    url: https://example.com/architecture-guide
    terms:
      status: verified
      license: CC-BY-4.0
relationships:
  - id: architecture-module-boundary
    source: example-architecture-guide
    type: adapted
    targets:
      - docs/architecture.md
    contribution: Informed the boundary between domain logic and external adapters.
```

Or validate a repository in GitHub Actions:

```yaml
- uses: actions/checkout@v6
- uses: raphaelsalaja/provenance@v0.2.1
  with:
    file: .provenance/provenance.yaml
```

`generate` creates a source catalog, an influence index grouped by affected
target, and a W3C PROV-compatible JSON-LD graph in `.provenance/output/`.

## Relationship vocabulary

| Type | Meaning |
| --- | --- |
| `consulted` | Considered as background without claiming adoption. |
| `inspired` | Affected direction without copying code, text, or assets. |
| `adapted` | Transformed a source pattern or material for the target. |
| `copied` | Reproduced source material substantially or verbatim. |
| `bundled` | Distributed the source material with the project. |
| `verified` | Supplied evidence for a claim, behavior, or test expectation. |

The [v0.1 specification](spec/v0.1.md) defines the normative semantics and
conformance levels. The [JSON Schema](schema/provenance.schema.json) defines the
machine-readable structure.

## What it complements

Provenance works alongside `CITATION.cff`, REUSE and SPDX licensing records,
SPDX SBOMs, W3C PROV, and build attestations. It does not replace them and does
not grant permission to reuse a source.

## License

Reference implementation code and the JSON Schema are MIT licensed. The
specification, documentation, and examples are licensed under CC BY 4.0.
