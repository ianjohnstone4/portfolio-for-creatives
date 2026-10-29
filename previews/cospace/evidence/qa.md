# CoSpace preview verification

Checked October 29, 2026.

## Source and visual checks

- Current portfolio homepage and three project pages were opened. SharedStandard was also inspected visually in the browser.
- The CoSpace Figma connection was verified. Homepage and review-screen design context were read, and the original PNG artwork was exported directly from Figma.
- Inspected the homepage, nearby map, location selector, full-day schedule, review, focus, and virtual-room artwork, plus the existing session wireflow and design guide.
- Native UI artwork is used intact inside the generated graphite device frame. The taller schedule retains its proportions and can be inspected at its natural size in the artwork dialog.
- Inspected the desktop hero, discovery compositions, hosting walkthrough, design system, gallery, and reflection. Reusable mockup JPEGs were exported from standalone HTML render pages and inspected after export.

## Functional and layout checks

- Local case study returned HTTP 200.
- Browser layouts checked at 1280 × 720, 768 × 1024, 390 × 844, and 320 × 780. No horizontal page overflow was observed.
- Verified all four hosting walkthrough states, selected-state updates, matching images and captions, screen counter, previous/next state, and disabled final-next control.
- Opened the selected screen and gallery review screen in the artwork dialog. Verified mobile dialog sizing, Escape dismissal, and return focus to the opener.
- The initial location source, full-day schedule, and focus source all appeared correctly in the walkthrough.
- No broken image loads were observed after navigating through the page.
- Syntax check: `node --check previews/cospace/cospace.js` passed.
- Reference audit: `python3 previews/cospace/scripts/verify.py` passed. It checks local file references, anchors, IDs, image alternatives, PNG validity, alpha-bearing device format, temporary asset URLs, and em dashes in runtime source.
- `git diff --check` passed.
- Page text contrast spot checks: muted body text on the page 6.67:1; hero label on blue background 5.68:1; white on the blue palette swatch 4.56:1; supporting-blue swatch text 5.50:1; yellow swatch text 7.33:1.
- Page animation is limited to small hover transitions, and reduced-motion CSS disables those transitions. Internal anchor movement is immediate.

## Scope and limits

These checks apply to the new case study page. They do not establish full WCAG conformance, screen-reader usability, native phone behaviour, or cross-browser coverage. The original Figma artwork retains its source text sizes, contrast, timer discrepancies, and prototype content. No original screens were redesigned during page implementation.

The source presentation supports the academic context, intended audience, and team roster. No individual contribution split or usability study was established. The page credits the team and presents proposed validation in future tense.

The Git diff is limited to `previews/cospace/` relative to the existing homepage preview branch. Production files and shared styles were preserved.
