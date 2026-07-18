# Creative Lab — Hero Section + Menu Overlay

## Purpose

Stand up the Creative Lab project (React + Vite) and implement the Hero section from Figma
(`G6icdiLONcBVlcExTmlykd`, nodes `1190-23928` closed-menu / `1190-24292` open-menu — one
component, two states), including its full entrance animation sequence and the expandable
menu overlay. Scope is the Hero + menu only; other site sections are future specs.

## Stack

- Vite + React + TypeScript.
- GSAP + `ScrollTrigger` as the animation engine.
- Lenis for smooth scroll, bridged to GSAP via `ScrollTrigger.scrollerProxy` +
  `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`.
- `vite-plugin-svgr` to import `Logo.svg` as a React component (needed for per-letter access).
- Other icons rendered as plain `<img src>` — no per-element animation needed on them.
- Text animation specs sourced from the bundled `animate-text` skill (`soft-blur-in`,
  `top-down-letters`), translated to GSAP per `assets/effects/<id>.json` gsap adapters.

## Assets

- `main page/picture` → `src/assets/images/`, `main page/icon` → `src/assets/icons/`,
  `font/Pretendard Variable.ttf` → `src/assets/fonts/`.
- Card row (left→right): `Img.png`, `Dyson.svg`, `Img-1.png`, `Img-2.png`, `xlash.png`,
  `Img-3.png`, `weekday.png`, `Img-4.png`.
- `Logo.svg`: mark = first 2 `<path>`s; wordmark "Creator Lab" = remaining 10 `<path>`s, one
  per letter, in right-to-left document order — sort by x-position for left-to-right stagger.
  Drop the dashed guide `<rect>` (Figma dev annotation, not part of the real mark).
- Font is a variable font; self-host via `@font-face` with `font-display: swap`, preload the
  woff/ttf.

## Component architecture

```
src/
  App.tsx                       — mounts Lenis, renders <Hero/>
  lib/gsap.ts                   — configured gsap + ScrollTrigger singleton
  lib/useLenis.ts               — Lenis instance + RAF/ScrollTrigger bridge
  sections/hero/
    Hero.tsx                    — layout + master timeline orchestration
    Header.tsx                  — logo, menu trigger, user icon, "Get Started"
    AnimatedLogo.tsx             — Logo.svg as component, per-letter top-down-letters
    HeroTitle.tsx                — heading + description, soft-blur-in + pink marker reveal
    HeroButtons.tsx               — 3x CircleRevealButton (Get Started, Apply as Brand, Apply as Creator)
    CardMarquee.tsx               — entrance stagger + infinite loop
    MenuOverlay.tsx                — pill ↔ panel morph, Dynamic-Island bounce
  styles/fonts.css, tokens.css, global.css
```

Each animated piece owns its own GSAP timeline; `Hero.tsx` holds a master timeline sequencing
them: logo → title → pink marker → buttons → cards. The whole entrance plays once,
automatically, right after page load / font-ready (not scroll-triggered) — this is a single
stage, no scroll-position-based staging.

## Animation behavior

- **Logo** (`top-down-letters`): each letter `<path>` animates from `translateY(-14px)
  opacity:0` to resting position, staggered ~30ms, slight overshoot ease. Container uses
  `overflow: visible` and extra top padding so no clipping occurs during the drop-in.
- **Title + description** (`soft-blur-in`, per animate-text skill's exact effect recipe):
  per-character blur+opacity+translateY reveal. Line-height and vertical padding sized to the
  effect's max blur radius + translate distance so ascenders/descenders never clip.
- **"Uzbekistan" pink marker**: pink box starts at `scaleX: 0` (`transform-origin: left`).
  Only once that word's own soft-blur-in characters finish does it animate to `scaleX: 1`
  (~0.45s, `power2.out`), reading as a marker swipe drawn under/behind the word.
- **3 buttons** (Get Started, Apply as Brand, Apply as Creator): each starts as a circle
  (`border-radius: 50%`, width = height = pill height), scales in, then morphs width from
  circle → measured pill width while the label/icon fade+slide in *during* that expansion
  (not before or after).
- **Cards**: entrance is a staggered left→right fade+blur-in (opacity + blur + small
  translateX, increasing delay per card). Once settled, the track (card list duplicated once
  for a seamless loop) animates `xPercent` continuously leftward, linear, infinite, no pause.
- **Menu**: the header's menu element morphs from the closed pill (`1190-23928` state) to the
  open panel (`1190-24292` state) via a width/height/border-radius tween using a bouncy ease
  (`elastic.out(1, 0.6)`-ish) for a Dynamic-Island feel. Panel content (Sitemap, Legal, Social)
  animates in with a short staggered fade+rise once the morph is mostly complete. Closing
  reverses: content fades out fast first, then the panel collapses back to the pill.

## Anti-clipping rule

Every animated text/letter wrapper gets `overflow: visible`, no ancestor `overflow: hidden` on
the animating axis, and line-height/padding sized to the max blur radius + translate distance
used by that element's effect — verified per effect, not assumed.

## Out of scope

- Any section beyond Hero + menu (footer, other page sections, routing).
- Backend/data wiring for the buttons (they're presentational only for this spec).
- Mobile/responsive breakpoints beyond what naturally falls out of the Figma frame (not
  explicitly requested; flag if the user wants a responsive pass).

## Testing / verification

- Visual check in the Vite dev server via the in-app browser: confirm layout matches the
  Figma screenshots, menu open/close works, all animations play once on load without
  clipping, marquee loops seamlessly.
