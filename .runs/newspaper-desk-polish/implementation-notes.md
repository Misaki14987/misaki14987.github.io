# Desk Heavy Prototype Implementation

## Files changed

- `src/pages/prototype/newspaper.astro`: UNIT plate and Paper Bridge transition layer; mobile-safe control placement.
- `src/components/prototype/newspaper/DeskVariant.astro`: committed masthead stamp.
- `src/components/prototype/newspaper/PrototypeSwitcher.astro`: explicit transition replay control.
- `src/scripts/client/prototype/newspaper.ts`: finite transition states, covered swap, acceleration, scroll opening, live reduced-motion cancellation.
- `src/styles/prototypes/newspaper.scss`: bridge-to-paper handoff and distinct Desk chapter events.

## Checks

- Heavy score: `90/100`, no hard fails.
- `pnpm build` and `pnpm test:theme` pass.
- Desktop and mobile Paper Bridge coverage pass.
- Acceleration settles in `2.2ms`; live reduced-motion settles in `43.6ms` with zero active animations.
- No horizontal overflow at `360`, `768`, `1024`, or `1440` pixels.
- No dependency or generated asset added; production UNIT remains unchanged.

## Prototype boundary

The reusable motion contract and four non-blocking production-port deviations are recorded in `motion-concept.json` and `qa-report.json`.
