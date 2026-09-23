import assert from "node:assert/strict";
import { test } from "node:test";
import { loadDocument } from "../src/load-document.js";
import { renderMarkdown } from "../src/render-markdown.js";

test("renders each source and relationship into human-readable views", async () => {
  const document = await loadDocument("examples/minimal/provenance.yaml");
  const output = renderMarkdown(document);

  assert.match(output.references, /Example Architecture Guide/);
  assert.match(output.references, /Inclusion records provenance/);
  assert.match(output.influences, /docs\/architecture\.md/);
  assert.match(output.influences, /explicit boundary between domain logic/);
  assert.equal(
    output.references.match(/<a id="example-architecture-guide"><\/a>/g)?.length,
    1,
  );
});

test("sorts sources and targets deterministically", async () => {
  const document = await loadDocument("examples/relationships/provenance.yaml");
  const output = renderMarkdown(document);

  assert.ok(
    output.references.indexOf("Example Arrow Icon") <
      output.references.indexOf("Example Library"),
  );
  assert.ok(
    output.influences.indexOf("assets/arrow.svg") <
      output.influences.indexOf("decisions/retry-policy.md"),
  );
});
