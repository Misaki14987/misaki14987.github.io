# Newspaper Theme Autonomous Workflow

## Objective

Turn the current newspaper prototypes into one production-quality Personal Newspaper theme while preserving the existing UNIT theme. The finished theme must feel materially different from UNIT, keep content readable through Ordered Disorder, and use scroll-driven paper, ink, print, and desk-object motion to tell a coherent story.

Use the canonical language in `CONTEXT.md`. Do not redefine those terms here.

## Authority

The agent may autonomously:

- choose among Press, Desk, and Archive using the evidence gates below;
- combine a small number of proven details from losing directions when they strengthen the winner's grammar;
- edit layouts, styles, motion scripts, theme switching, and prototype code;
- generate or reuse local visual assets when they reveal the actual newspaper object or print process;
- simplify or delete prototype code after its question is answered;
- run local servers, builds, browser checks, screenshots, and responsive audits;
- iterate until no major visual, interaction, accessibility, or responsive defect remains.

Stop only when a decision would destroy user content, require external publication, incur cost, or change the blog's content meaning. Ordinary visual judgment is not a reason to pause.

## Non-Negotiables

- Preserve UNIT as a complete selectable theme.
- Share posts, routes, encryption, SEO, RSS, and publication helpers across themes.
- Use real repository content; do not invent portfolio projects.
- Keep reading and interactive boxes non-overlapping. Only decoration may cross empty space.
- Keep rotations deterministic and within the limits defined by Ordered Disorder.
- Use browser-window scrolling. Do not lock or hijack scroll.
- Respect `prefers-reduced-motion` without removing content or controls.
- Maintain theme selection across Astro client navigation.
- Do not add a general theme framework until the second production theme proves the real seam.

## Phase 1: Prototype Evidence

This phase was completed for Press, Desk, and Archive; the evidence is archived in `newspaper-theme-verdict.md` and the temporary route has been removed. If the direction is revisited, create one temporary comparison route, inspect all candidates with real content, and remove it after recording a new verdict.

Capture at minimum:

- desktop home screenshots for Press, Desk, and Archive;
- mobile home screenshots for Press, Desk, and Archive;
- the Tech, Diary, and Focus Reader states for the leading direction;
- reduced-motion state;
- the UNIT-to-newspaper transition.

Score each direction from 1–5 on:

| Criterion | Weight |
| --- | ---: |
| Personal Newspaper identity | 3 |
| Scroll narrative and Opening Ritual | 3 |
| Ordered Disorder without confusion | 3 |
| Article and diary continuity | 2 |
| Mobile Edition quality | 2 |
| Motion originality and coherence | 2 |
| Production complexity | 1 |

Record the verdict and evidence in `docs/agents/newspaper-theme-verdict.md`. Select one direction; do not keep permanent sub-themes.

## Phase 2: Promote the Winner

Absorb the winner into the real theme and delete the losing variants once their useful decisions are recorded.

Promote in vertical order:

1. Opening Ritual and masthead.
2. Lead story and Editorial Columns.
3. Portfolio Plate and Classified Notice.
4. Publisher context, index, and correspondence.
5. Delivery Outro.
6. Article Scene and Focus Reader.
7. Diary entry and encryption boundary.

Keep the production interface small: selecting a theme, leaving the current theme, entering the next theme, and restoring it after navigation. Theme-specific layout and motion stay local to the theme implementation.

## Phase 3: Motion Pass

Every scene needs a purposeful physical event, but all events must share the newspaper grammar.

Required sequence:

```text
explicit theme switch
→ Plate Exit
→ Paper Bridge fully covers the viewport
→ layout swap
→ Transition Handoff
→ scroll-controlled Opening Ritual
```

Inside the theme, prefer native CSS, the Web Animations API, `IntersectionObserver`, and `requestAnimationFrame`. Add no animation dependency unless the proven design cannot be expressed correctly with installed or native capabilities.

Animation review rejects:

- generic repeated fade-and-rise reveals;
- autoplayed long sequences after the handoff;
- unrelated effects with no paper, ink, press, desk, archive, or delivery cause;
- movement that changes layout dimensions or causes overlap;
- effects that are impressive only on high-end hardware.

## Phase 4: Visual QA Loop

Repeat until clean:

```text
build → run local server → capture screenshots → inspect → patch → repeat
```

Verify at least these viewports:

- 1440×1200 desktop;
- 1000×1600 compact desktop/tablet;
- 390×844 mobile;
- 360×800 narrow mobile.

Check:

- no blank canvas, missing images, clipped controls, or incoherent overlap;
- readable Chinese and English titles at real lengths;
- stable dimensions during hover, entry, and loading;
- clear reading order with animation disabled;
- no horizontal page overflow outside an intentional Exploration Strip;
- theme switching works from home and article pages in both directions;
- browser back restores the homepage position;
- encrypted diary content remains protected.

## Phase 5: Verification And Cleanup

Required checks:

```bash
pnpm build
pnpm test:theme -- http://127.0.0.1:<dev-port>
```

Add one smallest runnable check for any new non-trivial transition state machine. Do not introduce a test framework only for this work.

Before completion:

- update `CONTEXT.md` only when canonical language changes;
- record the selected direction and why in prototype notes or an ADR;
- remove losing prototype routes, variants, switchers, and obsolete styles;
- preserve unrelated user changes;
- leave the worktree buildable;
- report the local preview URL and any deliberately deferred ceiling.

## Completion Gate

The work is complete only when:

1. UNIT and the Personal Newspaper are visibly and structurally distinct.
2. Switching shows a coherent exit, covered swap, and newspaper handoff.
3. The homepage reads as one scroll story from Opening Ritual to Delivery Outro.
4. Article and diary navigation preserve theme and reading continuity.
5. Desktop, mobile, reduced-motion, and production builds pass the evidence gates.
6. The prototype has been absorbed or deleted; no abandoned experimental variants remain.
