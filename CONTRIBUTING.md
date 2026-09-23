# Contributing

Provenance is a v0.1 proposal. Issues, examples from independent projects,
schema critiques, interoperability notes, and alternative implementations are
welcome.

By participating, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before opening a change

- Use an issue for changes to normative fields, relationship semantics, or
  conformance requirements.
- Keep examples fictional and product-neutral.
- Do not include confidential material, raw private conversations, credentials,
  or unnecessary personal data.
- Record external standards or sources in the relevant documentation when they
  materially inform a proposal.

## Development

Use Node.js 24 and pnpm 11.27.0.

```bash
pnpm install
pnpm check
```

When the minimal example or generators change, update and verify generated
artifacts:

```bash
pnpm generate:examples
pnpm generate:check
```

Tests use Node's built-in test runner. Test public behavior through exported
functions or the CLI. Use temporary directories for filesystem behavior and do
not require network access.

## Specification changes

A normative change should include:

1. The problem and a concrete generic example.
2. The proposed schema and semantic change.
3. Compatibility and migration impact.
4. Privacy and licensing implications.
5. Tests and updated generated examples.

The JSON Schema, specification prose, reference implementation, and examples
must agree. CI treats drift as a failure.

## Pull requests

Keep changes focused and describe the validation performed. Commits should use
[Conventional Commits](https://www.conventionalcommits.org/), such as
`feat: add dataset integrity metadata` or `docs: clarify adapted relationships`.

Contributions are accepted under the repository's existing licenses: MIT for
code and schemas, and CC BY 4.0 for specifications, documentation, and examples.
