import assert from "node:assert/strict";
import { test } from "node:test";
import { exportProvJsonLd } from "../src/export-prov-jsonld.js";
import { loadDocument } from "../src/load-document.js";

test("maps sources, targets, and qualified influences to PROV JSON-LD", async () => {
  const document = await loadDocument("examples/minimal/provenance.yaml");
  const output = exportProvJsonLd(document);
  const graph = output["@graph"];

  assert.equal(output["@context"].prov, "http://www.w3.org/ns/prov#");
  assert.ok(
    graph.some((entry) => entry["@id"] === "source:example-architecture-guide"),
  );
  assert.ok(
    graph.some(
      (entry) =>
        entry["@id"] === "target:docs%2Farchitecture.md" &&
        entry["prov:wasInfluencedBy"].some(
          (source) => source["@id"] === "source:example-architecture-guide",
        ),
    ),
  );
  assert.ok(
    graph.some(
      (entry) =>
        entry["@id"] === "influence:architecture-module-boundary" &&
        entry["provenance:relationshipType"] === "adapted",
    ),
  );
});
