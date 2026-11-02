# ScootRoute case-study design QA

Date: November 1, 2026.

final result: passed

No actionable P0, P1 or P2 findings remain in the inspected preview. This result covers the portfolio page, not validation of the ScootRoute product concept.

## Comparison target and state

- Source visual truth: `outputs/scootroute-web-directions/contemporary-editorial.png` in the ScootRoute workspace. This is the user's selected option 1, a 1024 × 1536 editorial direction image.
- Implementation: `http://127.0.0.1:4290/previews/scootroute/`.
- Main rendered evidence: [desktop](review/scootroute-desktop-final.jpg), [opening](review/scootroute-opening-final.jpg), [mobile](review/scootroute-mobile-final.jpg), [tablet](review/scootroute-tablet.jpg), [narrow mobile](review/scootroute-narrow-mobile-final.jpg).
- Desktop CSS viewport: 1440 × 900, device pixel ratio 1. The viewport capture is 1440 × 900; the full-page capture is 1425 × 8755 because the browser excludes its 15 px scrollbar.
- Tablet CSS viewport: 834 × 1112; full-page image width 819. Mobile: 390 × 844, full-page width 375. Narrow mobile: 320 × 740, full-page width 305. All use density 1.
- State: top of the page, default first source group expanded, other source groups collapsed, image dialog closed. Dialog checks are captured separately.
- [Source and final implementation together](review/editorial-comparison-final.jpg): both normalized to a 600 px content width. The source direction is not a browser capture with a defined CSS viewport, so this is a proportional composition review, not a pixel-perfect regression test.
- Focused evidence: [annotated critique](review/annotated-critique-final.jpg), [provider handoff](review/provider-handoff-final.jpg), [mobile metadata before and after](review/mobile-metadata-comparison.jpg), [narrow image viewer](review/viewer-narrow-mobile.jpg).

## Composition review

The new page was compared with SharedStandard, Velvet Pour, Lynn Valley Link, Granville Island and the approved CoSpace page at the first two desktop screenfuls and full-page scale.

- [Opening comparison](review/portfolio-opening-comparison-final.jpg).
- [Full-page comparison](review/portfolio-full-comparison-final.jpg).

Ignoring colour and artwork, ScootRoute still has a different structure: an argument-led opening beside a single functional screen, early annotated comparative evidence, a broad evidence matrix, a provider-boundary detail and an outcome ledger. It does not repeat CoSpace's three-phone hero, paired session cards, hosting walkthrough and closing device gallery.

## Required fidelity surfaces

| Surface | Review and result |
| --- | --- |
| Fonts and typography | Existing portfolio Jost remains the body and section typeface. Bricolage Grotesque is limited to the opening display, as an interpretation of the selected direction. Loaded 400 Jost and 700 Bricolage faces were checked in the browser. Heading wraps, captions and small labels were inspected at desktop, tablet, 390 px and 320 px widths. |
| Spacing and layout rhythm | Shared 8/16/32/48/64/128 spacing tokens inform the layout. The header, footer, content margins and neutral surfaces remain coherent with CoSpace. The first comparison exposed an undersized opening, corrected in the final capture. The mobile evidence table becomes a sequential stack with repeated labels. No horizontal overflow was found. |
| Colours and tokens | Shared primary text `#1f2a24`, secondary text `#4e5f56` and background `#fdfdfd` are reused. Project paper `#f6f5ef`, green `#355c49` and rust `#a9442c` distinguish evidence and response. The white header intentionally follows the current approved portfolio instead of the concept image's pale mint header. |
| Images and artwork | Six supplied interface assets were copied byte-for-byte and checked against SHA-256 hashes. Natural aspect ratios are preserved. The portfolio's existing graphite device asset is reused. Crops have a full-screen enlargement path. No finished interface was generatively redrawn. Annotations do not cover meaningful UI text after correction. |
| Copy and content | First-person contributions, secondary-research method, simulated data and unverified benefits remain explicit. The case does not claim Lime lacks parking planning. Its published UI is identified as Stuttgart imagery. The existing rental-handoff wording is shown faithfully and discussed as a refinement need. All 24 research/reference entries are linked. No em dashes occur in page HTML, CSS or JavaScript. |

## Comparison history and resolved findings

1. **P2, annotation crossed interface text.** The first return-planning outline intersected the ride distance and return-station name. The overlay is now positioned inside the actual cropped-image container, and the crop begins above the ride heading. The final critique capture shows clear separation around the return station and final walk without obscuring text.
2. **P2, reverse tabbing left the image viewer.** Shift+Tab from Close could reach the background. An explicit first/last focus loop was added. Retesting confirmed reverse Tab reaches the original-image link, forward Tab returns to Close, and Escape returns focus to the opener.
3. **P2, the opening was too small relative to the selected direction.** [First comparison](review/editorial-comparison-v1.jpg) showed an underscaled headline and device. The desktop display size and device region were enlarged. [Final comparison](review/editorial-comparison-final.jpg) restores the intended emphasis while retaining the approved portfolio header and body typography.
4. **P2, small inline enlargement controls.** Caption buttons initially measured 34 px high. They now have a 44 px minimum height. Tablet inspection confirmed the main button targets meet that minimum.
5. **P2, metadata text joined on mobile.** Hiding the role-strip line breaks caused words such as `prototypeUser` to join. The line breaks are retained. The [post-fix comparison](review/mobile-metadata-comparison.jpg) and fresh 390 px and 320 px captures confirm readable separation and no overflow.

Every visual correction was followed by a new rendered capture and inspection. The final comparison has no remaining moderate or major visual discrepancy requiring another revision.

## Interaction and implementation checks

- JavaScript syntax check passed.
- Local image, script and stylesheet targets exist; fragment targets resolve; 50 IDs are unique.
- Eight image elements have alternative text attributes. Decorative logo/hardware images use empty alt text. All visible page images loaded with nonzero natural dimensions.
- All 24 source entries are present in the HTML, including 18 core research sources. Official Vancouver, Lime and Citymapper references were revisited during this task. This is not a claim that every third-party website was available: the ScienceDirect page returned an automated-access restriction.
- Image opening, actual-size and fit modes, Close, Escape, forward and reverse Tab containment, and focus restoration were exercised. At 320 px the viewer fits within a 296 px dialog and remains dismissible.
- The primary prototype CTA opens the existing demo in a new tab at `http://127.0.0.1:4173/?mode=demo`.
- Source disclosures expand and collapse. The source-ledger jump and Back to top link work.
- Keyboard focus was observed as a 3 px rust outline with a 5 px offset. Skip navigation and labelled regions are present.
- Reduced-motion CSS removes animation and transitions. The browser environment did not expose a reduced-motion emulation control, so this rule was inspected rather than tested under an emulated system preference.
- No browser warnings or errors were recorded for the local case-study tab during final checks.
- Desktop, tablet, mobile and narrow-mobile page widths have no horizontal overflow. Image proportions and caption clearance were reviewed visually.
- Shared portfolio source files and deployment configuration were not edited. All additions are under `previews/scootroute/` on the isolated branch.

## Publication dependencies and remaining test limits

- The portfolio page is ready for preview review. Its prototype CTA is local to this computer. A verified hosted application URL is required before production publication.
- Do not remove `noindex` or add a homepage card until publication is requested.
- This review used the in-app Chromium browser. Native-device Safari/Firefox and assistive-technology testing remain outside this check.
- No primary user research or measured product outcomes are implied by this page QA.

## Implementation checklist

- [x] Preserve original screenshots and label provenance.
- [x] Compare the selected direction with the rendered page in one board.
- [x] Inspect readable details as well as full-page composition.
- [x] Fix and recheck all P0/P1/P2 findings.
- [x] Check desktop, tablet, mobile, narrow mobile and keyboard interactions.
- [x] Preserve the approved portfolio and live deployment.
