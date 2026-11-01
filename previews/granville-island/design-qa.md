# Granville Island case study QA

final result: passed

## Comparison targets

The source for portfolio conventions is the approved CoSpace page at `9076ea7`, `previews/cospace/index.html`, and `styles/style.css`. Live SharedStandard, Velvet Pour and Lynn Valley Link pages were also inspected. The intended composition changes are recorded in the README and were stated before implementation.

The artwork truth is the existing native Figma/PDF export set recorded in `asset-provenance.json`. Those source exports remain unchanged. All seven web crops were compared against their exact source pixels.

The implementation is `http://127.0.0.1:8873/previews/granville-island/`. Final captures are in `evidence/desktop-full.jpg`, `tablet-full.jpg` and `mobile-full.jpg`.

## Viewports and comparison evidence

- Desktop: 1440 × 1000 CSS pixels, device pixel ratio 1. Page captures exclude the 15-pixel scrollbar, yielding 1425-pixel artwork. CoSpace was captured at the same viewport and density.
- Tablet: 900 × 1000 CSS pixels. No horizontal document overflow.
- Mobile: 390 × 844 CSS pixels. Single-column sections and two-column metadata; no horizontal document overflow.
- Narrow mobile: 320 × 800 CSS pixels. The 66-pixel project title fits without horizontal overflow.
- `evidence/comparison-opening.jpg` and `comparison-full.jpg` place existing pages and the new page in the same grayscale comparison input. CoSpace and Granville use matched desktop viewports. The additional live Lynn Valley reference used a narrower viewport, so it informs broad structure rather than precise spacing comparisons. Some of that live page's artwork was unavailable in the reference capture.
- `evidence/artwork-fidelity.jpg` pairs the original IA crop, resized to its browser display dimensions, with the rendered artwork at the same scale. Original text, colours, proportions and layout are retained; browser resampling/JPEG capture introduces expected softness. The enlargement exposes native source pixels.

## Findings and fixes

No actionable P0, P1 or P2 findings remain.

- A mobile subtitle lost the space across a hidden line break. Explicit whitespace now keeps “More to discover. A clearer place to start.” readable. The title also retains word spacing when its line break is hidden at intermediate widths. The corrected mobile capture is `evidence/mobile-opening.jpg`.
- The initial split comparison needed a clearer boundary. It now has a visible divider and a dynamic explanation identifying the final and earlier portions. At either endpoint, the explanation identifies the complete version shown.
- The artwork scroll region is keyboard focusable, with a visible focus outline. `evidence/enlargement-keyboard.jpg` records the focused scroll area inside the native dialog.
- A lazy-loaded image was not painted in an initial capture immediately after navigation. The final captures were taken after navigating through the page and confirming every image had loaded. No blank artwork remains in the final implementation captures.

## Required fidelity surfaces

**Fonts and typography:** Jost loaded successfully. The page uses existing portfolio font and neutral-colour variables. Headings, paragraph measures and small labels were reviewed at all three primary widths. Original interface and IA typography remain inside the source artwork.

**Spacing and layout rhythm:** Header, footer and shell dimensions follow the approved CoSpace conventions. Desktop facts form a horizontal strip. The opening, large comparison, IA document spread, vendor detail and outcome register create distinct pacing. Mobile stacking and native-image enlargement prevent small artwork from being the only inspection option.

**Colours and tokens:** The portfolio's neutral background, dark green text, secondary text and footer colours are retained. Granville blue appears as a restrained accent and in original artwork. The case study makes no accessibility-compliance claim for the course prototype.

**Image quality and fidelity:** Seven crops match their original export pixels exactly. Declared PNG dimensions match the files. All rendered main-page image ratios were checked at desktop; no distorted ratios were found. Artwork is labelled as an excerpt where cropped. No synthetic replacement interface or device artwork was introduced.

**Copy and content:** Roles distinguish independent IA, three of five team interviews and shared final layouts. The timeline is February–April 2026, confirmed by Ian. Research observations, design intentions and untested outcomes are separated. Sample business content and original AI disclosures remain acknowledged. No research or impact metric was invented.

## Interactions and source checks

- Earlier/final buttons set the comparison to 0/100; Compare restores 50.
- Native slider arrow keys and Home/End update the reveal, selection state and accessible value.
- IA, vendor and menu-detail artwork open in the native modal with matching source content.
- Actual size displayed the IA artwork at its 1413-pixel source width.
- Escape and Close dismiss the dialog and return focus to the triggering control.
- Tab reaches the enlarged-artwork scroll region, whose focus outline is visible.
- Evidence and source disclosures open and close.
- Internal navigation and Back to top work. All 32 local references and 20 unique IDs were checked without missing targets.
- Browser console warnings/errors: none observed.
- Reduced motion: the page uses no animated transitions or autoplay. A reduced-motion rule disables inherited animations and transitions.
- All changed files are additions under the new preview folder. Approved pages and deployment files remain unchanged.

## Remaining verification limits

Full screen-reader testing, native devices and cross-browser testing remain outside this pass. Figma and the SharePoint workbook may require the reader's existing access. The portfolio page implements presentation interactions; it does not implement the underlying destination website or complete its unfinished prototype destinations.
