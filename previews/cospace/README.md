# CoSpace portfolio page preview

A responsive case study for the existing Ian Johnstone portfolio. This is an isolated addition under `previews/cospace/` on `codex/cospace-project-page`. Production pages, shared styles, the homepage preview, the custom domain, and deployment configuration are unchanged.

## Open locally

From the repository root:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/previews/cospace/`. The page reuses the existing portfolio stylesheet and IJ logo using relative paths. Keep this folder inside the repository when previewing it.

## What is implemented

- Responsive case study with project details, overview, design decisions, original wireflow, visual system, and reflection.
- Three-device hero, in-person and virtual showcases, and a three-screen gallery.
- Four-step hosting screen walkthrough with previous/next controls and current-step state.
- Enlarged artwork dialog with native focus containment, Escape dismissal, and return focus.
- Internal section links, project navigation, email contact, visible keyboard focus, reduced-motion support, and a skip link.

The screen walkthrough presents original Figma artwork. The portfolio page does not implement coworking bookings, maps, messaging, calling, identity checks, or a backend. The original interactive prototype is linked from the intro.

## Sources and visual approach

The page follows the current project pages at `https://ianjohnstone.ca/project-1.html`, `project-2.html`, and `project-3.html`: Jost typography, dark green text, a light background, a project metadata panel, labelled sections, large rounded showcases, and the existing contact language. Page-specific styling lives in `cospace.css`.

Figma file: `nlQ9Fp6Yjdfs2Hr9TyUSY2`. Native source exports are saved locally in `assets/screens/`. Their UI, text, colours, icons, and states are unchanged. The taller schedule uses `object-fit: contain` to preserve the full source; the artwork dialog displays it at its natural size with scrolling.

The graphite device frame was generated with the built-in image generation tool. The original Figma UI is layered over the frame with CSS, rather than regenerated. The exact generation prompt and asset provenance are in `evidence/`. The exported mockup JPEGs are browser renders of these compositions. They can be reused as portfolio images.

Reusable image files: `assets/mockups/cospace-hero.jpg`, `cospace-discovery.jpg`, and `cospace-key-screens.jpg`. Their standalone render sources are `mockup-hero.html`, `mockup-discovery.html`, and `mockup-key-screens.html`. `mockups.html` shows the three compositions together.

The available final-presentation text confirms IXD 103, the team roster, and the intended remote-worker/student audience. Its cover is dated December 11, 2025. Prototype session dates and counters are sample content. No research participants, usability results, production adoption, or productivity gains have been invented. Individual ownership remains a review item until Ian supplies the contribution split.

## Validation

Run the source and asset audit:

```sh
python3 previews/cospace/scripts/verify.py
node --check previews/cospace/cospace.js
git diff --check
```

Browser checks and screenshots are recorded in `evidence/qa.md`. This is a browser-tested preview, with native-device and full cross-browser accessibility testing still outstanding.

## Production integration after review

To use this page in production, keep its assets and relative references together, decide its permanent route, and add a CoSpace project link to the homepage. Remove the preview `noindex` metadata when the permanent page is ready. No production routing or publication is included in this change.
