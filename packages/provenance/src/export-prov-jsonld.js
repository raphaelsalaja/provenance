function targetId(target) {
  return `target:${encodeURIComponent(target)}`;
}

function sourceEntity(source) {
  return {
    "@id": `source:${source.id}`,
    "@type": "prov:Entity",
    "dcterms:title": source.title,
    "provenance:sourceType": source.type,
    ...(source.url ? { "prov:atLocation": source.url } : {}),
  };
}

export function exportProvJsonLd(document) {
  const sources = document.sources.map(sourceEntity);
  const targets = new Map();
  const influences = [];

  for (const relationship of document.relationships) {
    const influenceId = `influence:${relationship.id}`;
    influences.push({
      "@id": influenceId,
      "@type": "prov:Influence",
      "prov:entity": { "@id": `source:${relationship.source}` },
      "prov:influencer": { "@id": `source:${relationship.source}` },
      "provenance:relationshipType": relationship.type,
      "provenance:contribution": relationship.contribution,
      "provenance:target": relationship.targets.map((target) => ({
        "@id": targetId(target),
      })),
      ...(relationship.confidence
        ? { "provenance:confidence": relationship.confidence }
        : {}),
      ...(relationship.recordedAt
        ? { "prov:generatedAtTime": relationship.recordedAt }
        : {}),
    });

    for (const target of relationship.targets) {
      const id = targetId(target);
      const existing = targets.get(id) ?? {
        "@id": id,
        "@type": "prov:Entity",
        "dcterms:title": target,
        "prov:wasInfluencedBy": [],
        "prov:qualifiedInfluence": [],
      };
      existing["prov:wasInfluencedBy"].push({
        "@id": `source:${relationship.source}`,
      });
      existing["prov:qualifiedInfluence"].push({ "@id": influenceId });
      targets.set(id, existing);
    }
  }

  return {
    "@context": {
      prov: "http://www.w3.org/ns/prov#",
      dcterms: "http://purl.org/dc/terms/",
      provenance:
        "https://github.com/raphaelsalaja/provenance/blob/main/packages/provenance/spec/v0.1.md#",
    },
    "@graph": [
      {
        "@id": "project:root",
        "@type": "prov:Entity",
        "dcterms:title": document.project.name,
        ...(document.project.repository
          ? { "prov:atLocation": document.project.repository }
          : {}),
      },
      ...sources,
      ...[...targets.values()],
      ...influences,
    ],
  };
}
