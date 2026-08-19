# M1saK1 Blog

An editorial personal site where M1saK1 publishes articles, diary entries, projects, and personal context as a coherent reading experience.

## Language

**Personal Newspaper**:
The newspaper-themed homepage, where published content is the main subject and M1saK1 appears as its publisher through the masthead identity.
_Avoid_: Portfolio homepage, decorative desk

**Opening Ritual**:
A standalone first scroll scene that introduces the Personal Newspaper through its arrival and masthead before revealing the lead story.
_Avoid_: Welcome hero, masthead-and-headline first screen

**Scroll-driven Scene**:
A narrative scene whose meaningful progress follows the reader's scroll position instead of completing on a fixed timer.
_Avoid_: Autoplay sequence, scroll lock

**Editorial Columns**:
The post index following the lead story: Articles and Diary appear as parallel columns on desktop and in that order as a single flow on mobile.
_Avoid_: Mixed chronological feed, separate publications

**Portfolio Plate**:
A deliberate homepage section reserved for public work; it remains visible as an authored empty plate until real projects are published.
_Avoid_: Hidden empty section, invented project content

**Classified Notice**:
The empty state of the Portfolio Plate, presented with the visual language of a newspaper classified advertisement.
_Avoid_: Coming Soon banner, fake portfolio item

**Delivery Outro**:
The closing scene where the current edition folds and slides through a door-mounted mail slot, completing the homepage narrative.
_Avoid_: Infinite paper feed, street mailbox scene

**Ordered Disorder**:
A layout rule where readable and interactive content stays in non-overlapping grid boxes while paper edges, photographs, stamps, tape, and annotations may rotate or cross into adjacent empty space.
_Avoid_: Random placement, occluded content, overlapping layout boxes

**Focus Reader**:
The upright, centered reading state shared by all Design Directions. Direction-specific article objects expand into it while preserving the article URL and browser-window scrolling.
_Avoid_: Modal with nested scrolling, separate reader route

**Article Scene**:
The independent page at an article's canonical URL, with a direction-specific entry into the shared Focus Reader and browser-back restoration to the homepage position.
_Avoid_: Homepage overlay, reader-only route

**Exploration Strip**:
A contained horizontal tray used by Desk or Archive within the mobile page's vertical flow; it reveals more content without turning the whole page into a horizontal canvas.
_Avoid_: Page-wide horizontal scrolling, scroll hijacking

**Mobile Edition**:
The narrow-screen Personal Newspaper: a vertical primary flow with half-strength rotation and overflow, optional Exploration Strips for Desk or Archive, and a compressed Opening Ritual.
_Avoid_: Shrunken desktop canvas, reduced body text

## Theme Motion

**Theme Transition**:
The full changeover shown only after an explicit theme-switch action: UNIT exits, a paper bridge covers the change, and the Personal Newspaper enters.
_Avoid_: Replay on initial restoration, replay during same-theme navigation

**Plate Exit**:
The UNIT departure where colored print layers visibly misregister and are pulled away in sequence, leaving the black key plate briefly before paper covers the change.
_Avoid_: Exploding tiles, unrelated fade-out

**Paper Bridge**:
The blank aged sheet that rolls upward to cover the viewport, hides the layout swap, and becomes the entering newspaper; roller shadows and creases imply the press without showing a machine.
_Avoid_: Blank flash, separate transition object

**Transition Handoff**:
The point after Plate Exit and full Paper Bridge coverage when automatic motion ends and scrolling takes control of newspaper unfolding and masthead stamping.
_Avoid_: Autoplayed newspaper entrance, interactive layout swap

**Reading Continuity**:
Theme switching restarts the homepage narrative but preserves the nearest article heading and opens directly into the Focus Reader on article pages.
_Avoid_: Mid-homepage theme morph, lost article position

**Reduced Motion Edition**:
The static Personal Newspaper shown when reduced motion is requested: it keeps the paper identity while skipping narrative motion, the empty Opening Ritual, and Focus Reader expansion.
_Avoid_: Disabled functionality, animated scroll effects

**Performance Baseline**:
The minimum full-motion target: a mid-range Android phone from the last four years on a 60 Hz display and ordinary 4G, plus a typical integrated-graphics laptop.
_Avoid_: High-end-only motion target

**Placement Rhythm**:
The deterministic assignment of rotation and offset from an object's editorial type and reading position, remaining stable across reloads without per-post settings.
_Avoid_: Runtime randomness, per-post layout metadata

**Transition Object**:
The single purposeful object allowed to cross between two adjacent homepage scenes; ordinary decoration stays within its own scene.
_Avoid_: Unbounded cross-section decoration, fully isolated card bands

## Newspaper Directions

**Design Direction**:
One candidate spatial and motion grammar applied to the shared Personal Newspaper content; prototypes compare directions before one becomes the theme.
_Avoid_: Permanent sub-theme, combined mode

**Press**:
A production-line direction where the edition travels through rollers, ink impressions, cutting, folding, and delivery in strict vertical sequence.
_Avoid_: Freeform desk exploration

**Desk**:
An overhead personal-workspace direction where newspapers, clippings, photographs, books, and annotations form Ordered Disorder.
_Avoid_: Mechanical paper feed

**Archive**:
A newspaper-records direction where folders, index cards, drawers, and annotated clippings organize content for retrieval.
_Avoid_: Scattered personal workspace
