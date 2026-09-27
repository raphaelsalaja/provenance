import provenancePackage from "provenance-specification/package.json";
import { LogoMark } from "./logo-mark";

const repository = "https://github.com/raphaelsalaja/provenance";
const version = provenancePackage.version;
const assetBasePath = process.env.NODE_ENV === "production" ? "/provenance" : "";

const relationships = [
  ["consulted", "Read as background, without claiming that it changed the work."],
  ["inspired", "Changed the direction without copying code, text, or assets."],
  ["adapted", "Started with a source pattern or material, then changed it."],
  ["copied", "Reproduced source material substantially or verbatim."],
  ["bundled", "Shipped the source material with the project."],
  ["verified", "Provided evidence for a claim, behavior, or test expectation."],
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

const actionExample = `name: Validate provenance

on:
  pull_request:
  push:
    branches: [main]

jobs:
  provenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
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
      <a className="skip-link" href="#why">
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
              Provenance is a small record of what shaped a piece of software.
            </p>

            <p>
              Give an AI system a paper, a design study, or another codebase and
              some part of it may survive in the finished work. Usually, the
              reference does not. Provenance keeps the connection.
            </p>
          </header>

          <section id="why">
            <h2>Why I Made This</h2>
            <p>
              I kept running into the same problem when I built with AI. I would
              hand it a paper, point it at an implementation, or ask it to borrow a
              pattern. The result would change, but the repository would never show
              why.
            </p>
            <p>
              Software already has a few ways to explain where it came from.
              Dependencies tell you what it needs. Licenses tell you what you can
              use. Commit history tells you who changed the code. None says, “this
              source changed this decision.”
            </p>
            <p>
              That gap matters more now. An AI session can pull ideas, code, and
              language from everywhere, then blur the path back to each source.
              Sometimes the material is copied. More often, it is adapted until the
              origin disappears.
            </p>
            <p>
              I think open source should make that history visible. Provenance is
              my attempt: one small file beside the project, naming the sources and
              what each one shaped.
            </p>
          </section>

          <figure id="missing-graph" className="attribution-figure">
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
              Traditional media carries its citations forward. AI-assisted software
              often drops them.
              <br />
              Provenance keeps the path attached.
            </figcaption>
          </figure>

          <section id="record">
            <h2>One File</h2>
            <p>
              Everything lives in <code>provenance.yaml</code>: the project, the
              sources, and the relationships between those sources and the work.
            </p>
            <p>
              Nothing gets guessed. If the author, date, or usage terms are unknown,
              they stay unknown.
            </p>
            <CodeBlock label="provenance.yaml">{example}</CodeBlock>
            <p className="caption">
              Recording a source is not permission to copy, adapt, or redistribute
              it.
            </p>
          </section>

          <section id="relationships">
            <h2>Six Ways a Source Can Matter</h2>
            <p>
              Not every source matters in the same way. Reading something is
              different from adapting it, and adapting it is different from copying
              it. Provenance keeps those claims separate with six relationship
              types.
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
            <h2>Where It Fits</h2>
            <p>
              Provenance is deliberately narrow. It does not replace citation
              files, licenses, software bills of materials, or general provenance
              models. It records the piece they miss: how a source changed the
              work.
            </p>
            <ul className="standards">
              <li>
                <a href="https://citation-file-format.github.io/">CITATION.cff</a>
                <span>Tells people how to cite the project itself.</span>
              </li>
              <li>
                <a href="https://reuse.software/spec/">REUSE</a>
                <span>Records copyright and license details for repository files.</span>
              </li>
              <li>
                <a href="https://spdx.dev/use/specifications/">SPDX</a>
                <span>Describes licenses and software composition.</span>
              </li>
              <li>
                <a href="https://www.w3.org/TR/prov-overview/">W3C PROV</a>
                <span>Provides a general model that Provenance can export to.</span>
              </li>
            </ul>
          </section>

          <section id="adopt">
            <h2>Getting Started</h2>
            <ol className="getting-started">
              <li>
                <div>
                  <strong>Create the Record</strong>
                  <p>
                    Add <code>provenance.yaml</code> to the root of your repository.
                    The example above is enough to start.
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Describe the Influence</strong>
                  <p>
                    Add each source once. Then connect it to the files, decisions,
                    tests, or releases it shaped.
                  </p>
                </div>
              </li>
              <li>
                <div>
                  <strong>Keep It Valid</strong>
                  <p>
                    Update the record in the same pull request as the work. Add this
                    workflow to validate every change.
                  </p>
                </div>
              </li>
            </ol>
            <CodeBlock label=".github/workflows/provenance.yml">
              {actionExample}
            </CodeBlock>
            <p className="source-checkout">
              Working on Provenance itself? Run the workspace validator from this
              source checkout.
            </p>
            <CodeBlock label="From This Source Checkout">
              {
                "pnpm --filter provenance-specification provenance check ../../provenance.yaml"
              }
            </CodeBlock>
          </section>

          <footer>
            <p>
              Provenance is open source. If this feels useful, try it, break it, or
              tell me what is missing.
            </p>
            <a href={repository}>raphaelsalaja/provenance ↗</a>
          </footer>
        </article>
      </main>
    </>
  );
}
