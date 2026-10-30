# CoSpace preview verification

Checked October 29, 2026.

Discovery card alignment, October 30: the two feature cards use equal flexible caption rows, keeping the phone and enlargement caption rows aligned when descriptions wrap differently. Verified equal phone top/bottom coordinates and caption tops on desktop, equal phone positions at 900px, and normal stacking without horizontal overflow at 390px. Refreshed the discovery mockup export.

## October 30 spacing revision

- Matched the visible right handset edge to the 48px left copy inset at desktop width. The right-hand positioning includes the extra width created by its rotation and the transparent margins of the generated hardware image.
- Reduced the three hero phones slightly and moved the outer phones upward, leaving clear space above the lower caption. The right caption now shares the same inset as the left copy.
- Verified the revised composition at 1280px, 1024px, and 390px widths, with no horizontal overflow. Shared responsive insets are 48px, 30px, and 24px.
- Re-exported the hero mockup and saved desktop/mobile screenshots for the revision.

## Source and visual checks

Schedule correction, October 30: replaced the completed full-day schedule in the hosting walkthrough with the editable builder shown in the original project mockup. The composition uses the original 402 × 874 frame (`400:5690`), the check-in state (`490:2572`), and the next-block state (`510:3220`). Component artwork is positioned at the source coordinates. Removed the contain scaling that caused white strips inside the handset. The inline and enlarged views use the same source composition. Verified desktop and mobile rendering, equal artwork/viewport dimensions, and hiding the schedule layers when moving to Review.

- Current portfolio homepage and three project pages were opened. SharedStandard was also inspected visually in the browser.
- The CoSpace Figma connection was verified. Homepage and review-screen design context were read, and the original PNG artwork was exported directly from Figma.
- Inspected the homepage, nearby map, location selector, full-day schedule, review, focus, and virtual-room artwork, plus the existing session wireflow and design guide.
- Native UI artwork is used intact inside the generated graphite device frame. The schedule builder uses native component artwork at source coordinates and fills the same screen viewport as the other steps.
- Inspected the desktop hero, discovery compositions, hosting walkthrough, design system, gallery, and reflection. Reusable mockup JPEGs were exported from standalone HTML render pages and inspected after export.

## Functional and layout checks

- Local case study returned HTTP 200.
- Browser layouts checked at 1280 × 720, 768 × 1024, 390 × 844, and 320 × 780. No horizontal page overflow was observed.
- Verified all four hosting walkthrough states, selected-state updates, matching images and captions, screen counter, previous/next state, and disabled final-next control.
- Opened the selected screen and gallery review screen in the artwork dialog. Verified mobile dialog sizing, Escape dismissal, and return focus to the opener.
- The location, editable schedule builder, and focus source appeared correctly in the walkthrough.
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
