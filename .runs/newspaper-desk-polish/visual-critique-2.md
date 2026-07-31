# Desk Motion / Visual Critique 2

## Verdict

The implementation contains the requested physical events, but the current viewing path and evidence make much of that work read as restrained or absent. The newspaper art direction is coherent; the issue is event legibility, timing and what the viewer is actually present to witness.

## Five Highest-Impact Causes

### 1. Direct entry bypasses the signature story

The route initializes with `data-variant="desk"` and `render()` leaves the transition idle. The UNIT exit and Paper Bridge run only from the prototype's explicit `data-run-transition` control. A visitor opening the Desk route therefore lands directly on the folded newspaper and never sees UNIT leave, the bridge cover the swap, or the paper arrive. The strongest motion sequence is optional rather than the default first experience.

Visual consequence: the first impression is a static desk composition with a partially hidden sheet, not a theme changing through print plates and paper.

### 2. The captured evidence proves states, not the motion between them

`desktop-unit-exit.png` and `mobile-unit-exit.png` show color misregistration, but not the plates visibly pulling away or the black key plate lingering. The covered-swap frames prove opacity, and the handoff frames prove geometry, but there is no frame sequence that makes continuity from full bridge to folded newspaper perceptible. Chapter screenshots are all settled endpoints.

Visual consequence: QA can verify that each required state exists, while a critic still cannot see acceleration, weight, impact, easing or causality. The most important animation claims remain inferred from CSS rather than witnessed in the visual record.

### 3. Chapter entrances are easy to miss because they share one early, one-shot trigger

Every Desk chapter uses the same `IntersectionObserver` and the same `is-in-view` commit. The observer fires as soon as a scene enters the shared boundary and immediately unobserves it. On a normal scroll, much of the transition can finish while the viewer is still reading the previous section or while only the incoming section edge is visible. This is especially apparent at the long mobile chapter boundaries.

Visual consequence: Lead, Columns, Classified, About, Index and Exchange look like distinct arranged objects in settled screenshots, but the page rhythm can read as ordinary scrolling through already-placed content. The repeated trigger cadence weakens the intended sense that each chapter performs its own event.

### 4. Several events change position more than silhouette

The opening has a real fold pseudo-element, yet the handoff screenshot is mostly a blank rectangle and the midpoint screenshot catches the newspaper already cropped above the viewport. Lead, Classified and the postcards primarily travel in, rotate and settle; tape and stamps arrive late and at small scale. The strongest material changes, such as opening a cover or folding a page, are visually clearer in code than in the supplied frames.

Visual consequence: the shared paper-and-ink language is present, but at viewing speed some scenes register as polished translate/rotate entrances rather than paper being placed, opened, pressed or transformed.

### 5. The final delivery commits before the viewer reaches the object

The entire outro is observed as one scene. Once it intersects, the folded edition scales down and moves 190px into the slot on a fixed timeline. `mobile-chapter-outro.png` then shows a very large empty green field before a dim, nearly delivered paper at the bottom.

Visual consequence: the resolution feels like an object that has already disappeared rather than a final action the viewer causes and watches. This is the clearest chapter where motion can read as absent even though an animation did run.

## Desktop Acceptance Observations

- `desktop-covered-swap.png` passes edge-to-edge opacity. No UNIT or Desk layout leaks through the bridge.
- `desktop-desk-handoff.png` passes focal-subject clarity and object safety. The paper, pencil and coffee are separated cleanly with no text overlap.
- The handoff paper is visually blank, so this frame alone does not establish that it is the same edition which later carries the masthead.
- `desktop-opening-mid.png` provides a useful next-section hint, but the masthead is already cropped above the viewport. The screenshot does not make the unfolding or stamp impact independently legible.
- No desktop chapter screenshots were supplied. Desktop chapter layout can pass scripted overflow checks, but chapter motion visibility and overlap cannot be visually accepted from the current desktop evidence alone.

## Mobile Acceptance Observations

- UNIT misregistration, full Paper Bridge coverage and the folded Desk handoff remain readable at `390x844` without exposed layout edges.
- The handoff keeps the coffee, pencil and paper inside safe regions. No decoration crosses readable copy.
- The opening midpoint creates a clear handover to the lead clipping, but most of the newspaper is above the viewport; the fold and stamp are not visible together as one complete entrance beat.
- Reduced motion passes visually: the upright newspaper is complete, readable and followed immediately by real content without empty opening distance.
- Lead, Classified, About and Index keep readable content in a single column with no incoherent overlap.
- Columns intentionally exposes the diary edge beside the article pile. It overlaps the paper margin but not article text, so it reads as a contained next-object hint rather than a collision.
- Exchange exposes the second postcard as a horizontal continuation hint without covering the first card's text.
- The outro is the only mobile frame with materially weak composition: most of the viewport is empty before the already-receded edition and slot appear near the bottom.

## Visual Acceptance Bar For Revision

- A direct visit must visibly encounter the UNIT-to-paper story, or the route must make it unmistakable that the viewer is entering after that story; the current silent bypass is ambiguous.
- The evidence needs temporal samples for plate departure, bridge contraction, fold opening, stamp impact and at least three representative chapter events, not only start/end states.
- A chapter event should begin while its subject is substantially visible, so the viewer can watch the physical action instead of arriving after it commits.
- Opening and chapter events must show a readable silhouette or state change at normal scroll speed, not rely mainly on displacement.
- The final fold and mail-slot delivery must remain present long enough to be witnessed without producing the current empty mobile field.

