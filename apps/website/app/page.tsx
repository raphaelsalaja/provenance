import provenancePackage from "provenance-specification/package.json";

const repository = "https://github.com/raphaelsalaja/provenance";
const version = provenancePackage.version;

const sections = [
  ["introduction", "What it is"],
  ["missing-graph", "The missing graph"],
  ["record", "The record"],
  ["relationships", "Relationships"],
  ["standards", "How it fits"],
  ["adopt", "Getting started"],
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

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#introduction">
        Skip to content
      </a>

      <nav className="index" aria-label="On this page">
        <a className="back-link" href={repository}>
          ← GitHub
        </a>
        <ol>
          {sections.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <main id="content">
        <article>
        <header className="hero">
          <h1>Provenance</h1>
          <p className="meta">Open proposal · v{version}</p>
          <p className="intro">
            Provenance is an influence graph for software. It records the sources
            that shaped a project and exactly what they affected.
          </p>

          <figure className="influence" aria-label="An example influence record">
            <ol>
              <li>
                <span>source</span>
                <strong>Architecture guide</strong>
              </li>
              <li>
                <span>relationship</span>
                <strong>adapted</strong>
              </li>
              <li>
                <span>artifact</span>
                <strong>docs/architecture.md</strong>
              </li>
            </ol>
            <figcaption>
              A source, its relationship to the work, and the artifact it shaped.
            </figcaption>
          </figure>

          <p>
            Dependencies tell us what a program needs to run. Citations tell us
            what to read. Neither reliably records that a design study inspired a
            navigation model, a standard verified a test expectation, or an
            implementation pattern was adapted into a module.
          </p>
        </header>

        <section id="introduction">
          <h2>What Provenance is</h2>
          <p>
            Provenance is a small, versioned YAML or JSON record that lives beside
            the work. It names retrievable sources and links each one to the files,
            decisions, tests, or releases it influenced.
          </p>
          <p>
            It is a usable, tested v0.1 proposal—not an industry standard.
            Independent implementations and criticism are welcome.
          </p>
        </section>

        <section id="missing-graph">
          <h2>The missing graph</h2>
          <p>
            A dependency graph asks what must be present for software to build or
            run. An influence graph asks what source affected a decision, file,
            test, or release.
          </p>
          <dl className="comparison">
            <div>
              <dt>Dependency</dt>
              <dd>
                <code>package → package</code>
              </dd>
            </div>
            <div>
              <dt>Influence</dt>
              <dd>
                <code>source → relationship → target</code>
              </dd>
            </div>
          </dl>
          <p>
            A source list can prove that something was consulted. A relationship
            explains how it entered the work.
          </p>
        </section>

        <section id="record">
          <h2>One file, explicit connections</h2>
          <p>
            A record names the project, describes its sources, and connects them to
            stable targets. Unknown authorship, dates, or usage terms stay unknown
            rather than being invented.
          </p>
          <CodeBlock label="provenance.yaml">{example}</CodeBlock>
          <p className="caption">
            A citation records inclusion. It does not grant permission to copy,
            adapt, or redistribute a source.
          </p>
        </section>

        <section id="relationships">
          <h2>Six relationship types</h2>
          <p>
            The vocabulary stays deliberately small, distinguishing background
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
          <h2>How it fits</h2>
          <p>
            Provenance does one narrow job. It sits beside the formats already
            responsible for citation, licensing, composition, and build integrity.
          </p>
          <ul className="standards">
            <li>
              <a href="https://citation-file-format.github.io/">CITATION.cff</a>
              <span>How people should cite the project itself.</span>
            </li>
            <li>
              <a href="https://reuse.software/spec/">REUSE</a>
              <span>Copyright and license information for repository files.</span>
            </li>
            <li>
              <a href="https://spdx.dev/use/specifications/">SPDX</a>
              <span>Licensing and software composition.</span>
            </li>
            <li>
              <a href="https://www.w3.org/TR/prov-overview/">W3C PROV</a>
              <span>A general provenance model that Provenance can export to.</span>
            </li>
          </ul>
        </section>

        <section id="adopt">
          <h2>Getting started</h2>
          <p>Validate a record without adding a permanent dependency.</p>
          <CodeBlock label="Terminal">
            {`pnpm dlx provenance-specification@${version} check provenance.yaml`}
          </CodeBlock>
          <p>Or validate every change in GitHub Actions.</p>
          <CodeBlock label=".github/workflows/provenance.yml">
            {actionExample}
          </CodeBlock>
          <ul className="resources">
            <li>
              <a href={`${repository}/blob/main/packages/provenance/spec/v0.1.md`}>
                Specification ↗
              </a>
            </li>
            <li>
              <a
                href={`${repository}/blob/main/packages/provenance/schema/provenance.schema.json`}
              >
                JSON Schema ↗
              </a>
            </li>
            <li>
              <a href={`${repository}/tree/main/packages/provenance/examples`}>
                Examples ↗
              </a>
            </li>
            <li>
              <a href={`${repository}/releases`}>Releases ↗</a>
            </li>
          </ul>
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
