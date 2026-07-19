# Newspaper Theme Design Brief

## Status

Interview complete. This document defines the prototype contract; it does not select a final Design Direction or authorize production implementation.

## Experience

The theme is a Personal Newspaper published by M1saK1. Content is the subject; the author appears through the masthead and publisher identity rather than a portfolio-first introduction.

The visual system uses aged off-white paper, black ink, and restrained faded burgundy or dark green accents. It should feel art-directed and polished without a loading page. Optional WebGL may be considered only after a direction is selected and only when continuous three-dimensional paper deformation or lighting cannot be achieved convincingly otherwise. It must never carry content or navigation.

## Homepage Narrative

1. Opening Ritual: the newspaper arrives, unfolds, settles, and receives its masthead stamp.
2. Lead story: the latest article.
3. Editorial Columns: Articles and Diary appear side by side on desktop and sequentially on mobile.
4. Portfolio Plate: the empty portfolio is intentionally presented as a Classified Notice.
5. Publisher's desk: About and interests.
6. Archive index: tags and subjects.
7. Exchange column: friend links.
8. Delivery Outro: the edition folds and enters a door-mounted mail slot.

The Opening Ritual is a standalone first scene. Its meaningful progress is controlled by scrolling rather than autoplay. The masthead and lead story do not share the first viewport.

## Ordered Disorder

- Readable and interactive content occupies non-overlapping grid boxes.
- Short content cards rotate with their text. Long-form content becomes upright in the Focus Reader.
- Article cards and diary cards rotate by about `+/-1.25deg` on desktop; photographs and short clippings may reach about `+/-3deg`.
- Rotation and offset follow a deterministic Placement Rhythm based on editorial object type and reading position. They never use runtime randomness or per-post layout metadata.
- Paper edges, photographs, stamps, tape, and annotations may enter adjacent empty space but may not cover headings, body text, links, buttons, or form controls.
- Ordinary decoration stays within its scene. At most one purposeful Transition Object may cross each boundary between adjacent scenes.

## Prototype Directions

Press, Desk, and Archive are mutually exclusive prototype candidates. They share real content, narrative order, and acceptance criteria. A prototype-only control may switch between them for comparison; the production theme will keep only the selected direction.

| Scene | Press | Desk | Archive |
| --- | --- | --- | --- |
| Spatial rule | Strict vertical production line | Overhead personal workspace with the strongest Ordered Disorder | Dense, indexed records room |
| Newspaper entry | Sheet passes rollers and settles through press creases | Folded newspaper lands on the desk and opens | Newspaper is pulled from an archival sleeve and opened |
| Masthead | Ink impression | Hand stamp | Accession stamp and issue label |
| Lead story | Headline completes its press impression | Lead clipping is placed at the center | Current lead dossier is opened |
| Articles / Diary | Two parallel paper lanes | Two groups of clippings and private stationery | Two classified folders |
| Portfolio Plate | Classified column is printed | Torn classified notice | Empty project file with a classified notice |
| About | Colophon and editor credit | Personal objects and handwritten notes | Publisher biography file |
| Subject index | Type case and contents column | Index notebook and label slips | Card-catalog drawer |
| Friend links | Exchange notices | Postcards and contact scraps | Correspondence file |
| Outro | Edition folds into the door mail slot | Edition folds into the door mail slot | Edition folds into the door mail slot |

Each direction owns its physical actions. Narrative milestones and approximate scroll distance remain comparable. Press must not become a scattered desk, Desk must not become a mechanical feed, and Archive must not become a personal-object collage.

## Homepage And Article Pages

- Homepage cards navigate to canonical article URLs; articles are independent scenes, not overlays on a frozen homepage.
- The direction controls the article's initial physical object and surrounding environment.
- Press presents a freshly cut sheet, Desk a tilted clipping, and Archive a retrieved dossier.
- Clicking the tilted article object or its explicit control expands it into the shared Focus Reader.
- The Focus Reader is visually a centered, upright reading box but remains part of the canonical article page and uses browser-window scrolling.
- The Focus Reader preserves the existing table of contents, heading anchors, progress, code controls, footnotes, encryption gate, and adjacent-post navigation.
- Browser Back restores the prior homepage position.
- Direct article visits remain complete without homepage state.
- Without JavaScript or with reduced motion, the full upright reader is immediately available.

## Responsive Rules

### Desktop

- Articles and Diary use parallel Editorial Columns.
- The selected direction may use its full spatial composition within the Ordered Disorder rules.
- Short cards rotate by about `+/-1.25deg`; photographs and short clippings may reach `+/-3deg`.

### Mobile

- The Mobile Edition keeps a vertical primary page flow and does not shrink body text to preserve desktop composition.
- Rotation and overflow are approximately half desktop strength: short cards about `+/-0.6deg`, photographs and short clippings about `+/-1.5deg`.
- Articles precede Diary in the single-column reading order.
- Ordinary scenes must not cause page-level horizontal overflow.
- Desk and Archive may use contained Exploration Strips. They reveal the next item, support touch and keyboard navigation, and do not hijack vertical gestures.
- Press remains vertical.
- The Opening Ritual preserves the same narrative beats within about one and a half viewports and avoids long sticky locks.
- Article pages retain the explicit Focus Reader expansion; the full reader uses page scrolling and the available viewport width.

## Theme Transition

The full Theme Transition runs only after an explicit theme-switch action. Initial saved-theme restoration and navigation within the same theme render directly without replaying it.

1. Plate Exit: UNIT separates into blue, yellow, orange, and black print layers.
2. The layers visibly misregister; colored layers are pulled upward in sequence while the black key plate remains briefly.
3. Paper Bridge: a blank aged sheet rolls upward. Roller shadow and press creases imply machinery without showing a large machine.
4. At full coverage, the layout changes with no blank frame.
5. Transition Handoff: automatic motion stops with the newspaper partially folded.
6. Scrolling controls unfolding, crease settling, and masthead stamping before the lead story.

The automatic segment targets about `1.4s` on desktop and `1.1s` on mobile, with a hard maximum of `1.8s`. Wheel, touch, or `Escape` may accelerate it to a stable state.

Switching on the homepage returns to the top and begins the Opening Ritual. Switching on an article page preserves the nearest heading and opens directly into the upright Focus Reader.

## Motion Rules

- Physical actions must belong to paper, ink, print, desk objects, records, folding, or delivery.
- Each scene has one primary event; decoration must not compete with it.
- Continuous transformations such as unfolding, camera travel, and sheet movement are reversible with scroll.
- Discrete events such as stamping, stapling, developing a photograph, and mail-slot rebound complete once per visit and do not reverse.
- Previously completed discrete events remain settled when the reader scrolls back.
- Motion may not hide or delay essential content.

## Acceptance Criteria

### Motion And Interaction

- Start, intermediate, and final animation states do not occlude readable or interactive content.
- No unintended overflow or collision occurs at widths `360`, `390`, `768`, `1024`, and `1440` pixels.
- Vertical scrolling is not hijacked. Only an Exploration Strip consumes an intentional horizontal gesture.
- Focus remains sensible after theme switching, Focus Reader expansion, and client navigation.
- Astro client navigation mounts each interaction once and preserves theme and Back-navigation scroll restoration.
- Screenshot and scripted-scroll checks cover the homepage, an article page, and all three prototype directions.

### Performance

- The minimum full-motion target is the Performance Baseline defined in `CONTEXT.md`.
- Mobile `LCP <= 2.5s`, `CLS <= 0.1`, and `INP <= 200ms` under the agreed baseline.
- First-viewport text does not wait for motion, textures, or optional WebGL.
- Scripted scrolling has fewer than `5%` slow frames and no main-thread stall longer than `100ms`.
- Theme switching responds immediately, never shows an uncovered layout swap, and respects the `1.8s` hard limit.
- Accelerating or cancelling a transition reaches a stable state within `100ms`.
- Nonessential images and textures load outside the critical path and fall back to CSS paper styling.
- There is no loading page.

### Reduced Motion

- A live change to `prefers-reduced-motion: reduce` reaches the static state without requiring reload.
- Plate Exit, Paper Bridge, scroll parallax, unfolding, press impressions, developing, and delivery motion do not run.
- No WebGL scene is created.
- The empty Opening Ritual distance is removed; masthead and lead story appear directly.
- The Focus Reader is upright, expanded, and immediately readable without an extra action.
- Content, table of contents, code copying, encrypted-post unlocking, theme switching, navigation, and Exploration Strips remain functional.
- Static rotation causes no clipping or page-level horizontal overflow.
- Automated checks find no continuously updated animation frame or scroll-motion state.

## Prototype Decision

The prototype must use real blog content and make Press, Desk, and Archive switchable from one experimental route. Compare desktop and mobile screenshots and interaction traces. Select one direction only after the prototype demonstrates that its homepage, Article Scene, Mobile Edition, Theme Transition, and Reduced Motion Edition meet this contract.
