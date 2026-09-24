# Design QA

## Evidence

- Source visual truth: `https://benji.org/liveline` (Codex Browser tab 5 capture).
- Implementation: `http://127.0.0.1:3011/provenance` (Codex Browser tab 6 capture).
- Desktop viewport: 1440 × 1024 CSS pixels at device pixel ratio 2.
- Mobile viewport: 390 × 844 CSS pixels at device pixel ratio 2.
- State: top of the public single-page document, light theme, no interaction active.
- Density normalization: both desktop captures used the same browser, CSS viewport, and device pixel ratio. Mobile was checked independently at the same 390 × 844 viewport used for the source reference.

## Full-view comparison

The source and implementation were captured in the Codex Browser at the same desktop viewport and inspected together. Both use a 582px outer reading column, 16px desktop inset, 550px text measure, body-sized headings, quiet left-margin navigation, and a large opening demonstration area. The implementation intentionally substitutes an original cobalt source/relationship/artifact record for Liveline's orange animated chart.

## Focused comparison

- Typography: Liveline and Provenance both resolve to 14px Inter/system sans text with a 20px line height for titles, headings, and body copy.
- Measure: Liveline's root is 582px wide with 16px padding and a 550px content width. Provenance matches those values.
- Alignment: Liveline's desktop text begins at x=442px; Provenance begins at x=437.5px. The 4.5px difference is visually immaterial and results from each page's surrounding layout.
- Spacing: the title/metadata, opening statement, large demonstration field, caption, and first narrative paragraph follow the same vertical cadence.
- Colors: near-black text, white paper, and muted grey metadata match the source system. Cobalt replaces Liveline's orange as an intentional Provenance identity constraint.
- Assets: no Liveline assets, chart shapes, code, or text were copied. The influence record is original semantic HTML and project-specific content.
- Copy: all visible content describes Provenance and uses the specification's existing generic example and six normative relationship types.

## Findings

No actionable P0, P1, or P2 differences remain.

- P3: The source demonstration is animated while the Provenance record is static. This is intentional: the record explains a static specification concept without adding client-side JavaScript.
- P3: The desktop column is 4.5px left of the source capture. This does not change wrapping, hierarchy, or reading rhythm.

## Accessibility and behavior

- No horizontal overflow at 1440 × 1024 or 390 × 844.
- No browser console errors or warnings.
- The skip link becomes visible with a solid focus outline on keyboard focus.
- The desktop section index is removed from the mobile layout; the repository link remains available.
- Reduced-motion mode disables smooth scrolling.

## Comparison history

1. Initial implementation used an oversized display title, a wider content column, and a visually heavy fixed index. These were P1 hierarchy mismatches.
2. The first redesign reduced all primary typography to 14px, replaced the hero with a technical-essay opening, and softened the navigation. A P2 measure mismatch remained: the implementation exposed 582px of content instead of Liveline's 550px.
3. The final pass matched the 582px outer column, 16px desktop inset, 550px content width, 14px type, and 20px line height. Desktop and mobile browser captures showed no actionable mismatch.

## Implementation checklist

- [x] Match Liveline's reading measure and body-sized hierarchy.
- [x] Keep Provenance content, examples, color, and graphics original.
- [x] Preserve responsive behavior and keyboard focus.
- [x] Verify repository checks and production build.
- [x] Verify desktop and mobile browser rendering.

## Follow-up polish

The remaining P3 differences are intentional and do not block release.

final result: passed
