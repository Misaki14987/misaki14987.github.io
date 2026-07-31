# Implementation Notes

## Files changed

- `src/pages/index.astro`: author-first hero, process plates, batch-stamp Easter egg, print-section hooks, richer archive sheets.
- `src/styles/pages/index.scss`: registration, paper feed, section cut, responsive hero, reduced-motion fallback.
- `src/styles/components/units-shell.scss`: print-sheet archive, paper-corner states, process-color details, mobile tag rail.
- `src/scripts/client/home-motion.ts`: scoped pointer registration, scroll feed, one-shot section printing, triple-activation stamp.

## Checks

- `pnpm build`
- Chrome screenshots at desktop and true `390x844` mobile viewports
- Chrome DevTools interaction check for registration, batch stamp, archive reveal, and horizontal overflow
- Chrome DevTools timing check for a visible, settled three-stage entrance
- Desktop/mobile article screenshots
- `prefers-reduced-motion` screenshot

## Deviations

- No empty personal-work section was added. Real work entries can reuse the print-sheet system when content exists.
- No dependency, WebGL scene, generated person, or article-reading animation was added.
