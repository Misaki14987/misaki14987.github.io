# Newspaper Theme Verdict

Question: Which spatial and motion grammar should become the Personal Newspaper theme: Press, Desk, or Archive?

Status: Decided. Desk is the production direction.

## Evidence Score

Scores use the weighted criteria in `newspaper-theme-workflow.md` (maximum 80).

| Direction | Identity | Story | Ordered disorder | Reading | Mobile | Motion | Complexity | Weighted total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Press | 5 | 4 | 2 | 4 | 4 | 4 | 3 | 63 |
| Desk | 5 | 5 | 5 | 4 | 4 | 5 | 2 | 71 |
| Archive | 3 | 3 | 3 | 4 | 3 | 3 | 3 | 53 |

## Decision

Desk best expresses Ordered Disorder: the lead clipping, reading pile, private notebook, classified notice, index notebook, and postcards are different physical objects with a clear reading order. It also produces the most coherent motion vocabulary. Paper unfolds, clippings settle, covers open, stamps strike, and the finished edition folds into the mail slot.

The production direction keeps two Press decisions:

- a disciplined masthead and edition bar so the opening reads as a Personal Newspaper rather than a decorative desk;
- an underlying editorial grid that keeps interactive boxes upright enough to scan.

Archive's folders, drawers, dossier labels, and institutional gray-green room were rejected. They made the site feel like a records service rather than one person's publication.

The production theme is one Desk-based Personal Newspaper, not a permanent choice between three directions.

## Preflight CheckLoop - 2026-07-20

Read-only evidence audit via headless Chrome CDP across 1440×1200, 1000×1600, 390×844, 360×800. No code modified in that round. Raw measurements and screenshots in `.runs/preflight/`.

| # | Claim | Evidence (measured) | Verdict |
|---|---|---|---|
| 1 | Classified→About gap is natural reading distance, not a scroll dead zone | Empty gap (section bottom→next top): 182px @1440 (15.2% vh), 132px @1000 (8.3%), 86px @390 (10.2%), 86px @360 (10.8%). Uniform with all scene transitions (`margin-bottom: clamp(90px,14vw,190px)`). No near-one-screen empty zone (max gap 192px ≈ 12% vh). The prior "~621px" figure does not reproduce. | PASS |
| 2 | Diary/About/Index rotateY without obvious repetition | Three `::after` cover flips: diary −96°/.82s, about −98°/.82s, index −100°/.72s. Trigger scrollY @1440: columns 1720, about 3160, index 3760 (deltas columns→about 1440px, about→index 600px). Not three consecutive modules (Classified separates Diary from About/Index); closest pair about→index is 600px apart with reading between. Distinct container entrances (translateX / scale / opacity+scale) and cover labels/colors. Fast scroll: all 7 scenes still reveal. | PASS |
| 3 | Friend-image failure still degrades credibly | With `nan0in27.cn/*` + `summ2.link/*` blocked and cache disabled: `<img>` inside Exchange = 0 (text-only postcards, local CSS bg). The 2 external images live in `FriendLink.astro`, inside `[data-theme-content="units"]` which is `display:none` in newspaper theme (offsetParent null, painted 0). Only visible image is the local lead (loads). Visible-and-broken images = 0; no broken icon, blank card, or text misalignment. | PASS |
| 4 | Mobile Columns/Exchange scroll-snap does not harm discovery/reading/nav | Both trays: `scroll-snap-type:x mandatory`, `overflow-x:auto`, `overflow-y:auto`, `overscroll-behavior:auto`, `touch-action:auto`. Peek of 2nd card 39px @390 / 35px @360. Touch swipe scrolled columns 16→333 (revealed diary). Keyboard focus reaches diary (tray→max, visible) and last postcard (96–100% visible). ArrowDown from tray scrolls the page (vertical pass-through). Next scene reachable. No vertical scroll trap. | PASS |

Cross-checks: page-level horizontal overflow 0px at all 4 viewports (normal + reduced-motion). Reduced-motion: all 7 scenes content opacity 1 / visible, title filter none, overflow 0. Fast scroll 0 unrevealed; reverse scroll state preserved.

DEFER (do not block release; fix only if trigger fires):

- **D1 — About/Diary flip duration similarity.** diary & about share .82s (index is .72s). Trigger: a reviewer reports the two adjacent flips feel like the same template. Fix idea: nudge about to ~0.7s or vary its angle.
- **D2 — 390px last Exchange postcard focus offset.** Focusing the last postcard at 390px leaves its right 10px past the viewport (96% visible; fully visible at 360px). Trigger: any postcard body text gets clipped. Fix idea: `scroll-padding-inline` or focus-scroll tuning.
