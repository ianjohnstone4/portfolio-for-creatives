# ScootRoute portfolio preview

This is an isolated case-study page for Ian Johnstone's portfolio, based on the selected contemporary editorial direction. It does not change the approved homepage, shared stylesheet, existing case studies or deployment configuration.

## Preview

Run from the repository root:

```sh
python3 -m http.server 4290 --bind 127.0.0.1
```

Open [the local case study](http://127.0.0.1:4290/previews/scootroute/).

The primary prototype link points to the existing ScootRoute app at `http://127.0.0.1:4173/?mode=demo`. It works only on the computer running that app. Replace this with a verified hosted prototype URL before publishing the case study on the live portfolio. The page itself needs only a static server. It deliberately has `noindex, nofollow` while in preview.

Branch: `codex/scootroute-case-study`.

Base: `634598bddfb053eba3c7ba4467d02d9ec3073e04`, the approved portfolio state inspected for this work.

## Composition

1. The opening makes the design argument beside one relevant journey screen. It leads directly into a large annotated Lime critique, instead of a project-title banner followed by an overview.
2. The research is an evidence-to-decision matrix with a limitation alongside each inference. It replaces a conventional research/process timeline and keeps existing Lime capabilities visible.
3. The later narrative concentrates on the boundary between navigation and rental completion. A cropped handoff component and an outcome ledger replace a device gallery and numbered feature walkthrough.

The page reuses portfolio typography, colours, spacing tokens, navigation and footer conventions. The opening alone uses the selected direction's display treatment. All interface captures retain their original pixels and proportions. Overlays and annotations are separate from the source images.

## Content boundaries

- No interviews, surveys or participant usability tests were conducted.
- Eighteen core secondary sources and six supporting references are linked, with their intended use and limitations.
- Lime imagery comes from its published Stuttgart page. It is not a Vancouver capture. The app version and original capture date are unknown.
- Observations apply to the shown screens. The page explicitly acknowledges Lime's documented parking-planning features.
- ScootRoute availability and GPS states are simulated. Intended benefits are not measured outcomes.
- The prototype cannot reserve parking, unlock Lime vehicles, end rentals or verify billing. Outdoor reliability and background location behaviour are not established.

## Files

- `index.html`: page content and linked research ledger.
- `scootroute.css`: isolated layout, responsive rules, visible focus and reduced-motion support.
- `scootroute.js`: keyboard-accessible image viewer with fit and actual-size modes.
- `research-sources.json`: the 24 source entries used on the page.
- `asset-provenance.json`: source locations, dimensions and SHA-256 hashes for original artwork.
- `review/`: browser captures and comparison boards.
- [design-qa.md](design-qa.md): visual review, corrections, checks and remaining publication dependencies.
