# Granville Island portfolio preview

An isolated case study on `codex/granville-island-case-study`, based on the approved CoSpace preview at `9076ea7`. Only `previews/granville-island/` is added. Approved pages, shared styles, the homepage, custom domain and deployment configuration are unchanged.

## Preview

From the repository root, run `python3 -m http.server 8873 --bind 127.0.0.1` and open `http://127.0.0.1:8873/previews/granville-island/`.

The entry point is `index.html`, with scoped styling in `granville.css` and interactions in `granville.js`. It reuses the portfolio stylesheet and IJ logo. No build step or backend is required.

## Composition and narrative

The central story is the relationship between visitor tasks, Ian's independent information architecture and the team's research-informed layout decisions.

- An editorial masthead and horizontal project facts replace the right-hand metadata card used by the other case studies. A single desktop artwork excerpt establishes the web deliverable.
- The first substantive section follows a specific research observation into a hierarchy change. A keyboard-operable reveal comparison shows earlier and final homepage directions at the same scale.
- An IA document spread foregrounds Ian's independent contribution and explains content grouping, repeatable fields and secondary access. It replaces a generic process chronology or visual-system gallery.
- The vendor section connects a menu request to the actual interface action. A concise outcome register distinguishes delivered work, observed prototype navigation and further validation.

The page retains Jost, portfolio colour tokens, the approved header/footer conventions, spacing rhythm, visible focus and native artwork enlargement. Screenshots remain original artwork, including their original typography. No interface was generatively redrawn.

## Evidence and attribution

Ian confirmed independent IA work, wireframes, three personally conducted testing interviews and layout collaboration with Sara and Avery. The team research record contains five interviews. Final screens and layout changes are credited as shared work.

The project ran February–April 2026, confirmed by Ian in the portfolio chat. This is coursework and a Figma concept, not a commissioned or launched website.

The homepage attention finding comes from `User Research Interviews`, row 18. Practical-information and menu requests come from rows 26–31. The earlier homepage is not confirmed as the exact tested version. Revised hierarchy effectiveness and production impact remain unverified. Prototype ratings, reviews and business details are illustrative content.

The IA spread uses `GI - Informtion Hiearchy.pdf`, page 9, with rationale from pages 3 and 5–10. `asset-provenance.json` records exact source crops and hashes. The supplied project disclosures and original image-source categories remain acknowledged in the case study.

## Verification

- `python3 previews/granville-island/verify.py` checks local links, anchors, image dimensions, exact crop pixels and preview metadata. It requires Pillow and the existing portfolio export folder for pixel comparison.
- `node --check previews/granville-island/granville.js`
- `git diff --check`

Browser testing and visual comparisons are documented in `design-qa.md`. `evidence/` contains captures at desktop, tablet and mobile widths, a full-page comparison with existing projects, and an artwork fidelity comparison. The QA composites are review evidence only and are not used by the case study page.

## Integration after review

Choose a permanent route and link it from the portfolio when approved. Keep relative assets together and remove the preview `noindex` metadata at that point. This preview does not replace any production page or change the live website.
