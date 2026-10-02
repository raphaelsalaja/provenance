import assert from "node:assert/strict";
import { test } from "node:test";
import { loadDocument } from "../src/load-document.js";
import { renderMarkdown } from "../src/render-markdown.js";

test("renders each source and relationship into human-readable views", async () => {
  const document = await loadDocument(
    "examples/minimal/.provenance/provenance.yaml",
  );
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

test("renders an entity folder as a source index", async () => {
  const document = await loadDocument("examples/entities/.provenance");
  const output = renderMarkdown(document);

  assert.match(output.references, /Vercel/);
  assert.match(output.references, /https:\/\/nextjs\.org\/docs/);
  assert.match(output.references, /Part of:\*\* Vercel/);
  assert.match(output.influences, /apps\/website/);
  assert.match(output.influences, /informed the site structure/);
});

test("sorts sources and targets deterministically", async () => {
  const document = await loadDocument(
    "examples/relationships/.provenance/provenance.yaml",
  );
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
