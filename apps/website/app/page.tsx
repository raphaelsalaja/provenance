import provenancePackage from "provenance-specification/package.json";
import { LogoMark } from "./logo-mark";

const repository = "https://github.com/raphaelsalaja/provenance";
const version = provenancePackage.version;
const assetBasePath = process.env.NODE_ENV === "production" ? "/provenance" : "";

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

      <main id="content">
        <article>
          <header className="hero">
            <h1 className="brand">
              <LogoMark className="brand-mark" />
              <span>Provenance</span>
            </h1>
            <p className="intro">
              Provenance is an influence graph for software. It connects the
              sources a project draws from to the work they shaped.
            </p>

            <p>
              Dependencies show what a program needs to run. Citations point
              readers to sources. Provenance fills the gap between them: what
              changed because a source was considered.
            </p>
          </header>

          <section id="introduction">
            <hr />
            <h2>A Record of Influence</h2>
            <p>
              The graph lives in a small, versioned YAML or JSON file beside the
              work. Sources remain retrievable, and relationships describe their
              effect on the project.
            </p>
            <p>
              Provenance v0.1 is a tested proposal. It is not an industry standard.
              Independent implementations and criticism are welcome.
            </p>
          </section>

          <section id="why">
            <hr />
            <h2>Why I Made This</h2>
            <p>
              I made Provenance because references increasingly shape software
              through AI, while the finished repository rarely shows that
              influence.
            </p>
            <p>
              When I give an AI system a paper, design study, or implementation to
              consider, parts of that source can affect the result. The final code
              may preserve the decision while losing the path that led to it.
            </p>
            <p>
              Books and papers have citations. Software has dependencies, licenses,
              and commit history. None says, “this source changed this decision.”
            </p>
            <p>
              AI makes it easy to bring code, patterns, text, and ideas from many
              places into one project. Some material is copied directly. Other
              material is adapted until its origin becomes difficult to see.
            </p>
            <p>
              In open source software, I think that history should remain visible.
              Provenance is my attempt to make that practical: a small record that
              stays with the project, names each source, and explains what it
              shaped.
            </p>
          </section>

          <section id="missing-graph">
            <hr />
            <h2>The Missing Graph</h2>
            <p>
              A dependency graph records what software needs to build or run. An
              influence graph records which source affected a decision, file, test,
              or release.
            </p>
            <p>
              A source list shows what a project consulted. A relationship records
              how a source entered the work.
            </p>
            <figure className="attribution-figure">
              <object
                className="attribution-graphic"
                data={`${assetBasePath}/attribution-gap.svg`}
                type="image/svg+xml"
                role="img"
                aria-label="Traditional media carries a citation from a source to publication. In AI-assisted software, a Provenance record preserves the source connection while an unrecorded citation is lost."
                width={768}
                height={664}
                tabIndex={-1}
              >
                The attribution diagram could not be displayed.
              </object>
              <figcaption className="caption">
                Citations usually travel with traditional media. AI-assisted work
                can preserve the influence while dropping the reference. A
                Provenance relationship makes that path visible again.
              </figcaption>
            </figure>
          </section>

          <section id="record">
            <hr />
            <h2>One File, Explicit Connections</h2>
            <p>
              The project block identifies the work. Source entries describe each
              reference. Relationship entries connect those sources to stable
              targets. Missing authorship, dates, or usage terms remain explicitly
              unknown.
            </p>
            <CodeBlock label="provenance.yaml">{example}</CodeBlock>
            <p className="caption">
              A citation records inclusion. It does not grant permission to copy,
              adapt, or redistribute a source.
            </p>
          </section>

          <section id="relationships">
            <hr />
            <h2>Six Relationship Types</h2>
            <p>
              Six terms distinguish background reading, indirect influence, direct
              reuse, and factual verification.
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
            <hr />
            <h2>How It Fits</h2>
            <p>
              Provenance has one job: record how sources influenced software. It
              sits beside formats for citation, licensing, composition, and build
              integrity.
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
            <hr />
            <h2>Validate a Record</h2>
            <p>Validate this repository from a source checkout.</p>
            <CodeBlock label="From this repository">
              {"node packages/provenance/src/cli.js check provenance.yaml"}
            </CodeBlock>
            <p>Validate another repository in GitHub Actions.</p>
            <CodeBlock label=".github/workflows/provenance.yml">
              {actionExample}
            </CodeBlock>
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
