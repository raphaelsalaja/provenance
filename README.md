# Provenance

[![CI](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml/badge.svg)](https://github.com/raphaelsalaja/provenance/actions/workflows/ci.yml)

Provenance is an open proposal for recording the sources that shape software and
the specific decisions or artifacts they influence.

Software projects already have dependency graphs. Provenance adds an influence
graph for research, documentation, design references, datasets, code, media,
models, standards, and other source material.

> **Status:** v0.1 proposal. The format is usable and tested, but it is not an
> industry standard. Feedback and independent implementations are welcome.

## Why

A bibliography answers “what sources were consulted?” Provenance also answers:

- What did each source affect?
- Was it consulted, inspirational, adapted, copied, bundled, or used to verify a
  claim?
- Which file, decision, test, or release contains the result?
- Are the source's license or usage terms verified, unknown, or restricted?
- What evidence connects the source to the outcome?

Provenance does **not** grant reuse rights or replace license compliance, source
citation, software bills of materials, or build attestations.

## Quick start

The reference implementation requires Node.js 24 and pnpm 11.

```bash
git clone https://github.com/raphaelsalaja/provenance.git
cd provenance
pnpm install
pnpm provenance check examples/minimal/provenance.yaml
```

A minimal `provenance.yaml` looks like this:

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

Validate and generate portable views:

```bash
pnpm provenance check provenance.yaml
pnpm provenance generate provenance.yaml --output-dir generated
pnpm provenance export provenance.yaml --format prov-jsonld --output provenance.prov.jsonld
```

Or validate a repository in GitHub Actions:

```yaml
- uses: actions/checkout@v6
- uses: raphaelsalaja/provenance@v0.1.1
  with:
    file: provenance.yaml
```

`generate` creates:

- `REFERENCES.md` — a source catalog.
- `INFLUENCES.md` — source-to-target relationships grouped by affected target.
- `provenance.prov.jsonld` — a W3C PROV-compatible JSON-LD representation.

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

## Relationship to existing standards

Provenance complements established formats:

- [`CITATION.cff`](https://citation-file-format.github.io/) tells people how to
  cite a project.
- [REUSE](https://reuse.software/spec/) and SPDX expressions record copyright
  and licensing.
- [SPDX SBOMs](https://spdx.dev/use/specifications/) describe software
  composition.
- [W3C PROV](https://www.w3.org/TR/prov-overview/) provides a general provenance
  data model. Provenance can export a compatible JSON-LD graph.
- Build attestations describe how release artifacts were produced.

None of these formats alone records a concise, reviewable statement such as
“this design study inspired this navigation module.” That relationship is the
scope of this proposal.

## Design principles

- **Explicit:** every source is connected to at least one target.
- **Honest:** unknown authorship, dates, or terms stay unknown.
- **Reviewable:** public records are concise enough to review in a pull request.
- **Private by default:** raw prompts, chats, credentials, and private inputs do
  not belong in committed records.
- **Interoperable:** the data model maps to broader citation, licensing, and
  provenance standards without replacing them.
- **Product-neutral:** the specification and examples do not depend on any
  application, vendor, or agent.

## Project structure

```text
schema/       JSON Schema
spec/         versioned normative specifications
src/          reference CLI implementation
test/         behavior tests
examples/     fictional, product-neutral examples
action.yml    reusable Provenance Check action
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [GOVERNANCE.md](GOVERNANCE.md).
Specification discussions and independent implementation reports are especially
valuable during v0.x.

## License

Reference implementation code and the JSON Schema are MIT licensed. The
specification, documentation, and examples are licensed under CC BY 4.0. See
[LICENSE](LICENSE) and `LICENSES/`.
