# Desk Heavy Motion Prototype Notes

## Decision

**FAIL: production gate remains closed.**

The selected Desk route is a useful motion sketch, but it is not yet the Heavy prototype required by the approved flow. The prior `qa-report.json` validates the earlier UNIT implementation, not the UNIT-to-Desk transition or the selected Desk experience.

## What Already Passes

- The folded newspaper is an obvious animated subject on the Desk opening.
- Scroll drives paper settling and ink resolution without a new dependency.
- Desk objects and the major content scenes already exist at desktop and mobile sizes.
- `matchMedia` is listened to live, reduced mode settles the prototype, and the controller cleans up through the page lifecycle helper.
- The current mobile layout uses contained horizontal strips for Columns and Exchange instead of shrinking desktop composition.

## Why Heavy Fails

1. There is no UNIT plate-exit prototype.
2. There is no opaque Paper Bridge, covered layout swap, or frame-matched handoff into the Desk newspaper.
3. The chapter system is mostly shared opacity plus translate/rotate. It does not yet prove one distinct paper, ink, stamp, desk-object, or delivery event per chapter.
4. The scroll story stops after the opening; later observer reveals read as separate entrances rather than one edition moving through a workday.
5. No screenshots or scripted checks cover transition start, covered swap, handoff, mobile midpoint, acceleration, or a live reduced-motion change.

## Smallest Prototype That Can Pass

Use the existing `/prototype/newspaper?variant=desk` route and existing CSS/native APIs. Add only:

- a fixed inert transition layer containing four UNIT plate clones and one blank paper bridge;
- the finite desktop/mobile timeline from `motion-concept.json`;
- a frame-matched bridge-to-`.np-desk__newspaper` handoff;
- the full scroll opening and committed masthead stamp;
- one chapter proof, preferably Classified, including paper pull, tape pressure, and VACANT stamp;
- wheel, touchstart, and Escape acceleration;
- a live reduced-motion cancellation check.

Do not implement all remaining chapter polish before this path passes. Do not generate textures or add an animation package.

## Prototype Pass Checks

- Signature interaction is legible within three seconds of activating the theme switch.
- At the swap frame, the bridge covers all four viewport edges and is fully opaque.
- The first Desk frame matches the last bridge frame without a paper jump.
- Scrolling changes the paper from folded to open, resolves ink, and commits a visible stamp.
- Classified demonstrates a physical event rather than a generic reveal.
- Desktop `1440x900` and mobile `390x844` show no overlap at transition start, swap, handoff, opening midpoint, or settled state.
- A wheel, touchstart, or Escape during transition reaches stable Desk in less than `100ms`.
- Enabling `prefers-reduced-motion` mid-transition reaches the complete static Desk state without reload, empty opening space, or an active animation frame.
- Build passes and the browser console is clean.

Only after these checks pass should the Builder port the transition first, then implement the remaining chapter events without changing the Desk art direction.
