# Provenance Record Format

Use one source entry for each external source. Use one relationship entry for
each distinct effect that the source had on the project.

## Relationship Types

| Type | Use when the source... |
| --- | --- |
| `consulted` | supplied background but did not change the work. |
| `inspired` | changed the direction without copied material. |
| `adapted` | supplied a pattern or material that the project changed. |
| `copied` | appears substantially or verbatim in the project. |
| `bundled` | ships with the project. |
| `verified` | supports a claim, behavior, or test expectation. |

## Example

```yaml
sources:
  - id: example-guide
    type: documentation
    title: Example Guide
    url: https://example.com/guide
    terms:
      status: unknown

relationships:
  - id: example-module-boundary
    source: example-guide
    type: adapted
    targets:
      - src/module.ts
    contribution: Informed the boundary between domain logic and adapters.
```

Use stable lowercase kebab-case IDs. Keep target paths relative to the project
root. Add `recordedAt`, `confidence`, or evidence only when the value is known.
