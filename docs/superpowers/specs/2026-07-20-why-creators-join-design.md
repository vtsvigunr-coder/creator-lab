# Why Creators Join section — design

## Source
Figma (`Creator Lab Web`, file `G6icdiLONcBVlcExTmlykd`):
- Slide 1 — node `1515:21830`
- Slide 2 — node `1190:24683`
- Slide 3 — node `1190:24698`

## Placement
New section `WhyCreatorsJoin`, rendered after `WhyNow` in `src/App.tsx`.

## Structure
`src/sections/why-creators-join/`
- `WhyCreatorsJoin.tsx`
- `WhyCreatorsJoin.module.css`
- `slides.ts`

### Head block (static across slides)
- `WipeRevealTag` label: "Why creators join"
- Heading (2 lines, `AnimatedChars`): "NOT FOR EVERYONE." / "FOR SERIOUS PLAYERS."
- Description (3 lines, `AnimatedWords`): "Creator Lab is built for brands that want real sales, and creators who want long-term value." / "We are building a curated ecosystem for:"
- Entrance timeline identical to `Solution.tsx`: wipe tag → soft-blur heading chars → word-reveal description, `scrollTrigger: { trigger: root, start: 'top 65%', once: true }`.

### Stage (pinned, scroll-scrubbed)
- Pinned via `ScrollTrigger` on the section root, same mechanics as `OurPlatform.tsx` (`pin`, extra scroll height = `2 × viewport` for 2 transitions across 3 slides, `scrub: true`, `snap` to nearest slide on release).
- 3 slide layers, absolutely stacked, each rendering: product image (object-fit: contain, in a fixed-size stage box), one caption (`captionSide: 'left' | 'right'`), two floating icon badges (already-styled SVGs, no extra background styling needed).
- Slide data (`slides.ts`): `{ id, image, caption, captionSide, icons: [{ src, top, left }, { src, top, left }] }`, positions taken from Figma per slide:
  1. `join-1` (bag) — caption left "Brands ready to scale through creators", icons `join-icon-1` / `join-icon-1.1` (green)
  2. `join-2` (tablet+pouch) — caption right "Creators building trust and long-term income", icons `join-icon-2` / `join-icon-2.1` (violet)
  3. `join-3` (toaster+phones) — caption left "Partners shaping where commerce is headed", icons `join-icon-3` / `join-icon-3.1` (yellow)
- **Transition behavior:** sequential fade, no overlap — slide *i*'s whole layer (image + caption + icons) fades out completely, then slide *i+1*'s layer fades in. Two half-length tween segments per transition (mirrors `OurPlatform`'s total scrub duration of `1`, split as fade-out `0.5` then fade-in `0.5`, `ease: 'none'` for the scrub, ranked by `ScrollTrigger`'s scrub position — not simultaneous crossfade like `OurPlatform`).

## Assets
Move from `main page/` into the project:
- `main page/picture/join-1.png` → `src/assets/images/why-join-1.png`
- `main page/picture/join-2.png` → `src/assets/images/why-join-2.png`
- `main page/picture/join-3.png` → `src/assets/images/why-join-3.png`
- `main page/icon/join-icon-1.svg`, `join-icon-1.1.svg` → `src/assets/icons/`
- `main page/icon/join-icon-2.svg`, `join-icon-2.1.svg` → `src/assets/icons/`
- `main page/icon/join-icon-3.svg`, `join-icon-3.1.svg` → `src/assets/icons/`
- (`main page/icon/join-icon-1.png` is an unused duplicate — not moved.)

## Tokens
None needed — icon SVGs already bake in their own badge background/color, so no new color tokens required.

## Out of scope
- No changes to other sections.
- No new shared animation utilities — reuse existing soft-blur/word-reveal/wipe-tag patterns and `gsap`/`ScrollTrigger` helpers from `src/lib/gsap`.
