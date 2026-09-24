import provenancePackage from "provenance-specification/package.json";

const repository = "https://github.com/raphaelsalaja/provenance";
const version = provenancePackage.version;

const sections = [
  ["introduction", "Introduction"],
  ["missing-graph", "The missing graph"],
  ["record", "The record"],
  ["relationships", "Relationships"],
  ["standards", "How it fits"],
  ["adopt", "Use it"],
] as const;

const relationships = [
  ["consulted", "Considered as background without claiming adoption."],
  ["inspired", "Affected direction without copying code, text, or assets."],
  ["adapted", "Transformed a source pattern or material for the target."],
  ["copied", "Reproduced source material substantially or verbatim."],
  ["bundled", "Distributed the source material with the project."],
  ["verified", "Supplied evidence for a claim, behavior, or test expectation."],
] as const;

const example = `schemaVersion: "0.1"
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
    contribution: Informed the boundary between domain logic
      and external adapters.`;

const actionExample = `- uses: actions/checkout@v6
- uses: raphaelsalaja/provenance@v${version}
  with:
    file: provenance.yaml`;

function CodeBlock({ children, label }: { children: string; label: string }) {
  return (
    <figure className="code-block">
      <figcaption>{label}</figcaption>
      <pre tabIndex={0}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 96 24" aria-hidden="true" focusable="false">
      <path d="M2 12h86" />
      <path d="m80 4 9 8-9 8" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <nav className="index" aria-label="On this page">
        <a className="index-mark" href="#top" aria-label="Provenance home">
          P
        </a>
        <ol>
          {sections.map(([id, label], index) => (
            <li key={id}>
              <a href={`#${id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
        <a className="index-github" href={repository}>
          GitHub ↗
        </a>
      </nav>

      <main id="content">
        <article>
          <header className="hero" id="top">
            <div className="eyebrow">
              <span>Open proposal</span>
              <span>v{version}</span>
            </div>
            <h1>Provenance</h1>
            <p className="lede">
              An influence graph for software: a small, reviewable record of the
              sources that shaped a project and exactly what they affected.
            </p>
            <div
              className="signal"
              aria-label="A source influences a project artifact"
            >
              <span>Source</span>
              <Arrow />
              <span>Relationship</span>
              <Arrow />
              <span>Artifact</span>
            </div>
          </header>

          <section id="introduction">
            <p className="section-label">01 — Introduction</p>
            <h2>
              Software remembers what it uses. It should remember what shaped it.
            </h2>
            <p>
              Dependencies tell us what a program needs to run. Citations tell us
              what to read. Neither reliably records that a design study inspired a
              navigation model, a standard verified a test expectation, or an
              implementation pattern was adapted into a module.
            </p>
            <p>
              Provenance records those connections in a versioned YAML or JSON file
              that can be reviewed beside the work itself.
            </p>
            <aside>
              <strong>Status:</strong> Provenance is a usable, tested v0.1
              proposal—not an industry standard. Independent implementations and
              criticism are welcome.
            </aside>
          </section>

          <section id="missing-graph">
            <p className="section-label">02 — The missing graph</p>
            <h2>Dependencies and influences answer different questions.</h2>
            <div className="comparison" role="list">
              <div role="listitem">
                <p className="comparison-title">Dependency graph</p>
                <p>What must be present for this software to build or run?</p>
                <code>package → package</code>
              </div>
              <div role="listitem">
                <p className="comparison-title">Influence graph</p>
                <p>What source affected this decision, file, test, or release?</p>
                <code>source → relationship → target</code>
              </div>
            </div>
            <p>
              The distinction matters during review. A source list can prove that
              something was consulted, but only a relationship explains how it
              entered the work.
            </p>
          </section>

          <section id="record">
            <p className="section-label">03 — The record</p>
            <h2>One file, explicit connections.</h2>
            <p>
              A record names the project, describes retrievable sources, and links
              each source to one or more stable targets. Unknown authorship, dates,
              or usage terms stay unknown rather than being invented.
            </p>
            <CodeBlock label="provenance.yaml">{example}</CodeBlock>
            <p className="note">
              A citation records inclusion. It does not grant permission to copy,
              adapt, or redistribute a source.
            </p>
          </section>

          <section id="relationships">
            <p className="section-label">04 — Relationships</p>
            <h2>Say what happened.</h2>
            <p>
              Six intentionally small relationship types distinguish background
              reading from direct reuse and factual verification.
            </p>
            <dl className="relationships">
              {relationships.map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="standards">
            <p className="section-label">05 — How it fits</p>
            <h2>Designed to sit beside existing standards.</h2>
            <p>
              Provenance does one narrow job. It complements the formats already
              responsible for citation, licensing, composition, and build integrity.
            </p>
            <ul className="standards">
              <li>
                <a href="https://citation-file-format.github.io/">
                  CITATION.cff ↗
                </a>
                <span>How people should cite the project itself.</span>
              </li>
              <li>
                <a href="https://reuse.software/spec/">REUSE ↗</a>
                <span>Copyright and license information for repository files.</span>
              </li>
              <li>
                <a href="https://spdx.dev/use/specifications/">SPDX ↗</a>
                <span>Licensing and software composition.</span>
              </li>
              <li>
                <a href="https://www.w3.org/TR/prov-overview/">W3C PROV ↗</a>
                <span>A general provenance model that Provenance can export to.</span>
              </li>
            </ul>
          </section>

          <section id="adopt">
            <p className="section-label">06 — Use it</p>
            <h2>Start with validation, keep the record reviewable.</h2>
            <p>Run the reference CLI without adding a permanent dependency:</p>
            <CodeBlock label="Terminal">
              {`pnpm dlx provenance-specification@${version} check provenance.yaml`}
            </CodeBlock>
            <p>Or validate every change in GitHub Actions:</p>
            <CodeBlock label=".github/workflows/provenance.yml">
              {actionExample}
            </CodeBlock>
            <div className="link-grid">
              <a href={`${repository}/blob/main/packages/provenance/spec/v0.1.md`}>
                <span>Specification</span>
                <small>Normative semantics ↗</small>
              </a>
              <a
                href={`${repository}/blob/main/packages/provenance/schema/provenance.schema.json`}
              >
                <span>JSON Schema</span>
                <small>Machine-readable format ↗</small>
              </a>
              <a href={`${repository}/tree/main/packages/provenance/examples`}>
                <span>Examples</span>
                <small>Generic records ↗</small>
              </a>
              <a href={`${repository}/releases`}>
                <span>Releases</span>
                <small>Versions and notes ↗</small>
              </a>
            </div>
          </section>

          <footer>
            <p>Provenance is open source and open for discussion.</p>
            <a href={repository}>raphaelsalaja/provenance ↗</a>
          </footer>
        </article>
      </main>
    </>
  );
}
