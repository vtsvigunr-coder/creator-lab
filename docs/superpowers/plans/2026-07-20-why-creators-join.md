# Why Creators Join Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Why Creators Join" section — a pinned, scroll-scrubbed 3-slide stage (bag / tablet+pouch / toaster+phones) placed after `WhyNow` in the page, matching the Figma design and the codebase's existing GSAP/ScrollTrigger reveal patterns.

**Architecture:** One new section component (`WhyCreatorsJoin`) with a static head block (tag + heading + description, entrance-only) and a pinned canvas below it containing 3 absolutely-stacked slide layers. `ScrollTrigger` pins the section for extra scroll height and scrubs a timeline that sequentially fades slide layers out then in (no crossfade overlap), snapping to the nearest slide on release — mirroring `OurPlatform.tsx` but without its rail/tab-list.

**Tech Stack:** React 19, TypeScript, CSS Modules, GSAP + ScrollTrigger (via `src/lib/gsap`), Vitest + Testing Library.

## Global Constraints
- Follow the existing section pattern exactly (`WipeRevealTag`, `AnimatedChars`, `AnimatedWords` from `src/components`, entrance timeline `scrollTrigger: { trigger: root, start: 'top 65%', once: true }`).
- Canvas is a fixed 1440×932 composition, scaled responsively via a `--scale` CSS custom property at breakpoints, exactly like `OurPlatform.module.css`'s `.canvas` (1440×901, `--platform-scale`).
- Coordinates below are absolute pixels within the 1440×932 canvas, taken from Figma metadata (nodes `1515:21830`, `1190:24683`, `1190:24698`, file `G6icdiLONcBVlcExTmlykd`).
- Sequential fade, not crossfade: slide *i* fades fully out (opacity 0) before slide *i+1* fades in — implemented as two half-duration segments per transition.
- No new shared animation helpers — reuse `gsap`/`ScrollTrigger` from `src/lib/gsap`.

---

### Task 1: Move assets into the project

**Files:**
- Move: `main page/picture/join-1.png` → `src/assets/images/why-join-1.png`
- Move: `main page/picture/join-2.png` → `src/assets/images/why-join-2.png`
- Move: `main page/picture/join-3.png` → `src/assets/images/why-join-3.png`
- Move: `main page/icon/join-icon-1.svg` → `src/assets/icons/why-join-icon-1.svg`
- Move: `main page/icon/join-icon-1.1.svg` → `src/assets/icons/why-join-icon-1-2.svg`
- Move: `main page/icon/join-icon-2.svg` → `src/assets/icons/why-join-icon-2.svg`
- Move: `main page/icon/join-icon-2.1.svg` → `src/assets/icons/why-join-icon-2-2.svg`
- Move: `main page/icon/join-icon-3.svg` → `src/assets/icons/why-join-icon-3.svg`
- Move: `main page/icon/join-icon-3.1.svg` → `src/assets/icons/why-join-icon-3-2.svg`

**Interfaces:**
- Produces: 9 static asset files at the paths above, importable from `src/sections/why-creators-join/slides.ts` in Task 2.

- [ ] **Step 1: Move the files**

```bash
cd "/Users/valeriytsvigun/creative lab"
mkdir -p src/assets/images src/assets/icons
mv "main page/picture/join-1.png" src/assets/images/why-join-1.png
mv "main page/picture/join-2.png" src/assets/images/why-join-2.png
mv "main page/picture/join-3.png" src/assets/images/why-join-3.png
mv "main page/icon/join-icon-1.svg" src/assets/icons/why-join-icon-1.svg
mv "main page/icon/join-icon-1.1.svg" src/assets/icons/why-join-icon-1-2.svg
mv "main page/icon/join-icon-2.svg" src/assets/icons/why-join-icon-2.svg
mv "main page/icon/join-icon-2.1.svg" src/assets/icons/why-join-icon-2-2.svg
mv "main page/icon/join-icon-3.svg" src/assets/icons/why-join-icon-3.svg
mv "main page/icon/join-icon-3.1.svg" src/assets/icons/why-join-icon-3-2.svg
```

- [ ] **Step 2: Verify the files landed correctly**

Run: `ls src/assets/images/why-join-*.png src/assets/icons/why-join-icon-*.svg`
Expected: 3 `.png` files and 6 `.svg` files listed, no errors.

- [ ] **Step 3: Commit**

```bash
git add -A src/assets "main page"
git commit -m "Move Why Creators Join assets into src/assets"
```

---

### Task 2: Slide data module

**Files:**
- Create: `src/sections/why-creators-join/slides.ts`

**Interfaces:**
- Consumes: the 9 asset files from Task 1 (`src/assets/images/why-join-{1,2,3}.png`, `src/assets/icons/why-join-icon-{1,1-2,2,2-2,3,3-2}.svg`).
- Produces:
  - `type JoinIcon = { src: string; top: number; left: number }`
  - `type JoinSlide = { id: string; image: string; caption: string; captionSide: 'left' | 'right'; captionTop: number; icons: [JoinIcon, JoinIcon] }`
  - `export const JOIN_SLIDES: JoinSlide[]` (3 entries) — consumed by `WhyCreatorsJoin.tsx` in Task 3.
  - All coordinates are absolute pixels within the 1440-wide canvas (`left`/`top` match Figma frame-absolute positions; `captionTop` likewise). `captionSide === 'left'` slides use `caption.left` fixed at 120px; `'right'` slides anchor the caption's right edge, computed in the component from the 1440 canvas width.

- [ ] **Step 1: Write the file**

```typescript
import join1 from '../../assets/images/why-join-1.png'
import join2 from '../../assets/images/why-join-2.png'
import join3 from '../../assets/images/why-join-3.png'
import icon1a from '../../assets/icons/why-join-icon-1.svg'
import icon1b from '../../assets/icons/why-join-icon-1-2.svg'
import icon2a from '../../assets/icons/why-join-icon-2.svg'
import icon2b from '../../assets/icons/why-join-icon-2-2.svg'
import icon3a from '../../assets/icons/why-join-icon-3.svg'
import icon3b from '../../assets/icons/why-join-icon-3-2.svg'

export type JoinIcon = {
  src: string
  top: number
  left: number
}

export type JoinSlide = {
  id: string
  image: string
  caption: string
  /** Which side of the image the caption sits on, per the Figma layout. */
  captionSide: 'left' | 'right'
  captionTop: number
  icons: [JoinIcon, JoinIcon]
}

/**
 * All positions are absolute pixels within the 1440-wide canvas, taken directly from the
 * Figma frame metadata (nodes 1515:21830, 1190:24683, 1190:24698).
 */
export const JOIN_SLIDES: JoinSlide[] = [
  {
    id: 'brands',
    image: join1,
    caption: 'Brands ready to scale through creators',
    captionSide: 'left',
    captionTop: 592,
    icons: [
      { src: icon1a, top: 594, left: 860 },
      { src: icon1b, top: 661, left: 520 },
    ],
  },
  {
    id: 'creators',
    image: join2,
    caption: 'Creators building trust and long-term income',
    captionSide: 'right',
    captionTop: 562,
    icons: [
      { src: icon2a, top: 716, left: 921 },
      { src: icon2b, top: 488, left: 464 },
    ],
  },
  {
    id: 'partners',
    image: join3,
    caption: 'Partners shaping where commerce is headed',
    captionSide: 'left',
    captionTop: 567,
    icons: [
      { src: icon3a, top: 518, left: 758 },
      { src: icon3b, top: 646, left: 557 },
    ],
  },
]
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b --noEmit`
Expected: no errors referencing `slides.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/sections/why-creators-join/slides.ts
git commit -m "Add Why Creators Join slide data"
```

---

### Task 3: WhyCreatorsJoin component (static structure, no animation)

**Files:**
- Create: `src/sections/why-creators-join/WhyCreatorsJoin.tsx`
- Create: `src/sections/why-creators-join/WhyCreatorsJoin.module.css`
- Create: `src/sections/why-creators-join/WhyCreatorsJoin.test.tsx`

**Interfaces:**
- Consumes: `JOIN_SLIDES` from `./slides` (Task 2), `WipeRevealTag` (`src/components/WipeRevealTag`), `AnimatedChars`/`AnimatedWords` (`src/components/AnimatedText`).
- Produces: `export default function WhyCreatorsJoin()`, rendering `data-testid="why-creators-join"` on the root `<section>`, `data-testid="why-creators-join-caption"` is NOT used (captions identified by text content in tests) — each slide layer carries `data-join-layer` and `data-join-id={slide.id}`; the image inside carries `data-join-image`; the caption `<p>` carries `data-join-caption`. Task 4 attaches animation using these hooks plus `useLayoutEffect`/`useRef`.

- [ ] **Step 1: Write the failing test**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import WhyCreatorsJoin from './WhyCreatorsJoin'
import { JOIN_SLIDES } from './slides'

describe('WhyCreatorsJoin', () => {
  it('renders the heading, description, and all three slide captions', () => {
    render(<WhyCreatorsJoin />)

    const root = screen.getByTestId('why-creators-join')
    expect(root).toHaveTextContent('Not for everyone.For serious players.')
    expect(root).toHaveTextContent('Creator Lab is built for brands that want real sales')

    for (const slide of JOIN_SLIDES) {
      expect(screen.getByText(slide.caption)).toBeInTheDocument()
    }
  })

  it('renders exactly one layer per slide, each with its image and two icons', () => {
    render(<WhyCreatorsJoin />)

    const layers = screen.getAllByTestId((_, el) => el?.hasAttribute('data-join-layer') ?? false)
    expect(layers).toHaveLength(JOIN_SLIDES.length)

    layers.forEach((layer, i) => {
      expect(layer).toHaveAttribute('data-join-id', JOIN_SLIDES[i].id)
      expect(layer.querySelectorAll('[data-join-icon]')).toHaveLength(2)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/why-creators-join/WhyCreatorsJoin.test.tsx`
Expected: FAIL — `Cannot find module './WhyCreatorsJoin'`

- [ ] **Step 3: Write the component**

```typescript
// src/sections/why-creators-join/WhyCreatorsJoin.tsx
import { useRef } from 'react'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import { JOIN_SLIDES } from './slides'
import styles from './WhyCreatorsJoin.module.css'

const HEADING_LINE_1 = 'Not for everyone.'
const HEADING_LINE_2 = 'For serious players.'
const DESCRIPTION =
  "Creator Lab is built for brands that want real sales, and creators who want long-term value. We are building a curated ecosystem for:"

export default function WhyCreatorsJoin() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <section className={styles.whyCreatorsJoin} data-testid="why-creators-join" ref={rootRef}>
      <div className={styles.stage}>
        <div className={styles.canvas} ref={canvasRef}>
          <div className={styles.head}>
            <div className={styles.headGroup}>
              <WipeRevealTag label="Why creators join" />
              <h2 className={styles.heading}>
                <div>
                  <AnimatedChars text={HEADING_LINE_1} />
                </div>
                <div>
                  <AnimatedChars text={HEADING_LINE_2} />
                </div>
              </h2>
            </div>
            <p className={styles.description}>
              <AnimatedWords text={DESCRIPTION} />
            </p>
          </div>

          <div className={styles.slides}>
            {JOIN_SLIDES.map((slide) => (
              <div
                key={slide.id}
                className={styles.layer}
                data-join-layer
                data-join-id={slide.id}
              >
                <img className={styles.image} src={slide.image} alt="" data-join-image />
                <p
                  className={`${styles.caption} ${
                    slide.captionSide === 'left' ? styles.captionLeft : styles.captionRight
                  }`}
                  style={{ top: slide.captionTop }}
                  data-join-caption
                >
                  {slide.caption}
                </p>
                {slide.icons.map((icon, i) => (
                  <img
                    key={i}
                    className={styles.icon}
                    src={icon.src}
                    alt=""
                    style={{ top: icon.top, left: icon.left }}
                    data-join-icon
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write the CSS**

```css
/* src/sections/why-creators-join/WhyCreatorsJoin.module.css */
.whyCreatorsJoin {
  position: relative;
  height: 100vh;
  background: var(--color-white);
}
.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1440px;
  height: 932px;
  transform: translate(-50%, -50%) scale(var(--join-scale, 1));
}

/* --- static head block, positions matching the Figma frame's absolute y's:
   tag at y74, heading at y126 (gap 24 after the 28px-tall tag), description at y262
   (gap 36 after the 100px-tall heading) --- */
.head {
  position: absolute;
  left: 0;
  top: 74px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}
.headGroup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.heading {
  margin: -20px 0;
  padding: 20px 0;
  font-weight: 800;
  font-size: 46px;
  line-height: 50px;
  letter-spacing: -0.92px;
  text-transform: uppercase;
  text-align: center;
  color: var(--color-dark-gray);
}
.description {
  margin: -8px 0;
  padding: 8px 0;
  width: 357px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.48px;
  text-align: center;
  color: var(--color-gray);
}

/* --- slide layers, absolutely stacked and stage-positioned like OurPlatform's canvas --- */
.slides {
  position: absolute;
  inset: 0;
}
.layer {
  position: absolute;
  inset: 0;
}
.image {
  position: absolute;
  left: 452px;
  top: 376px;
  width: 535px;
  height: 456px;
  object-fit: contain;
}
.caption {
  position: absolute;
  margin: 0;
  width: 285px;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.96px;
  color: var(--color-dark-gray);
}
.captionLeft {
  left: 120px;
}
.captionRight {
  left: 1035px;
}
.icon {
  position: absolute;
  width: 42px;
  height: 42px;
}

@media (max-width: 1280px) {
  .canvas {
    --join-scale: 0.82;
  }
}
@media (max-width: 1024px) {
  .canvas {
    --join-scale: 0.66;
  }
}
@media (max-width: 768px) {
  .canvas {
    --join-scale: 0.45;
  }
}
@media (max-width: 480px) {
  .canvas {
    --join-scale: 0.32;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/why-creators-join/WhyCreatorsJoin.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/sections/why-creators-join/WhyCreatorsJoin.tsx src/sections/why-creators-join/WhyCreatorsJoin.module.css src/sections/why-creators-join/WhyCreatorsJoin.test.tsx
git commit -m "Add WhyCreatorsJoin static structure"
```

---

### Task 4: Entrance animation + pinned scroll-scrub slide transitions

**Files:**
- Modify: `src/sections/why-creators-join/WhyCreatorsJoin.tsx`
- Modify: `src/sections/why-creators-join/WhyCreatorsJoin.module.css`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger` from `../../lib/gsap` (same import used in `OurPlatform.tsx:2`); DOM hooks from Task 3 (`data-wipe-tag` via `WipeRevealTag`, `data-soft-blur-char`/`data-desc-word` via `AnimatedChars`/`AnimatedWords`, `data-join-layer`, `data-join-id`).
- Produces: no new exports — behavior only. `.whyCreatorsJoin` root height becomes `calc(100vh + 240px)` to provide scrub scroll distance (was `100vh` in Task 3, corrected here to match the pin technique).

- [ ] **Step 1: Update the CSS root height for scrub distance**

In `WhyCreatorsJoin.module.css`, change:

```css
.whyCreatorsJoin {
  position: relative;
  height: 100vh;
  background: var(--color-white);
}
```

to:

```css
.whyCreatorsJoin {
  position: relative;
  /* Two transitions across 3 slides, scrubbed — same extra-height technique as OurPlatform. */
  height: calc(100vh + 240px);
  background: var(--color-white);
}
```

- [ ] **Step 2: Add the animation effect to the component**

Replace the full contents of `WhyCreatorsJoin.tsx` with:

```typescript
import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import { JOIN_SLIDES } from './slides'
import styles from './WhyCreatorsJoin.module.css'

const HEADING_LINE_1 = 'Not for everyone.'
const HEADING_LINE_2 = 'For serious players.'
const DESCRIPTION =
  "Creator Lab is built for brands that want real sales, and creators who want long-term value. We are building a curated ecosystem for:"

export default function WhyCreatorsJoin() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const ctx = gsap.context(() => {
      const layers = Array.from(canvas.querySelectorAll<HTMLElement>('[data-join-layer]'))

      // Only the first slide starts visible; the same soft-blur-in state used by every other
      // reveal in this codebase, applied here to the whole layer instead of individual words.
      gsap.set(layers[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
      layers.slice(1).forEach((layer) => {
        gsap.set(layer, { opacity: 0, y: 10, filter: 'blur(8px)' })
      })

      // 1. Entrance — tag wipe, heading soft-blur, description word-reveal. Fires once; the
      //    pinned stage below is untouched by this timeline.
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } })
        .from(canvas.querySelectorAll('[data-wipe-tag]'), {
          width: 0,
          paddingLeft: 0,
          paddingRight: 0,
          duration: 0.55,
          ease: 'sine.inOut',
        })
        .from(
          canvas.querySelectorAll('[data-soft-blur-char]'),
          {
            opacity: 0,
            y: 16,
            filter: 'blur(12px)',
            duration: 0.9,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.025,
          },
          0.25,
        )
        .from(
          canvas.querySelectorAll('[data-desc-word]'),
          {
            opacity: 0,
            y: 10,
            filter: 'blur(8px)',
            duration: 0.6,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.03,
          },
          0.25,
        )

      // 2. Slide switching — scrubbed against the pinned stage. Unlike OurPlatform's
      //    simultaneous crossfade, each transition is two back-to-back halves: the current
      //    layer fades fully out, then the next layer fades in — no overlap.
      const switchTl = gsap.timeline({ paused: true })
      for (let i = 0; i < layers.length - 1; i++) {
        switchTl.to(
          layers[i],
          { opacity: 0, y: -10, filter: 'blur(8px)', duration: 0.5, ease: 'power1.in' },
          i,
        )
        switchTl.fromTo(
          layers[i + 1],
          { opacity: 0, y: 10, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
          i + 0.5,
        )
      }

      ScrollTrigger.create({
        animation: switchTl,
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        snap: {
          snapTo: 1 / (layers.length - 1),
          duration: 0.4,
          ease: 'power1.inOut',
        },
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.whyCreatorsJoin} data-testid="why-creators-join" ref={rootRef}>
      <div className={styles.stage}>
        <div className={styles.canvas} ref={canvasRef}>
          <div className={styles.head}>
            <div className={styles.headGroup}>
              <WipeRevealTag label="Why creators join" />
              <h2 className={styles.heading}>
                <div>
                  <AnimatedChars text={HEADING_LINE_1} />
                </div>
                <div>
                  <AnimatedChars text={HEADING_LINE_2} />
                </div>
              </h2>
            </div>
            <p className={styles.description}>
              <AnimatedWords text={DESCRIPTION} />
            </p>
          </div>

          <div className={styles.slides}>
            {JOIN_SLIDES.map((slide) => (
              <div
                key={slide.id}
                className={styles.layer}
                data-join-layer
                data-join-id={slide.id}
              >
                <img className={styles.image} src={slide.image} alt="" data-join-image />
                <p
                  className={`${styles.caption} ${
                    slide.captionSide === 'left' ? styles.captionLeft : styles.captionRight
                  }`}
                  style={{ top: slide.captionTop }}
                  data-join-caption
                >
                  {slide.caption}
                </p>
                {slide.icons.map((icon, i) => (
                  <img
                    key={i}
                    className={styles.icon}
                    src={icon.src}
                    alt=""
                    style={{ top: icon.top, left: icon.left }}
                    data-join-icon
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run the full test suite for this section**

Run: `npx vitest run src/sections/why-creators-join/WhyCreatorsJoin.test.tsx`
Expected: PASS (2 tests) — jsdom has no real ScrollTrigger/scroll, but `gsap.context`/`ScrollTrigger.create` must not throw during render, and the static assertions (heading text, captions, layer/icon counts) still hold since GSAP `.from()`/`.set()` calls don't remove the elements.

- [ ] **Step 4: Commit**

```bash
git add src/sections/why-creators-join/WhyCreatorsJoin.tsx src/sections/why-creators-join/WhyCreatorsJoin.module.css
git commit -m "Animate Why Creators Join entrance and pinned slide transitions"
```

---

### Task 5: Wire the section into the page

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `WhyCreatorsJoin` default export from Task 4.
- Produces: `WhyCreatorsJoin` rendered as the last section in `App`, after `WhyNow`.

- [ ] **Step 1: Add the import and render it after WhyNow**

In `src/App.tsx`, add the import alongside the other section imports:

```typescript
import WhyCreatorsJoin from './sections/why-creators-join/WhyCreatorsJoin'
```

and add `<WhyCreatorsJoin />` after `<WhyNow />` inside the root `<div>`:

```typescript
      <WhyNow />
      <WhyCreatorsJoin />
    </div>
  )
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, all suites including `WhyCreatorsJoin.test.tsx` and no regressions in other section tests.

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc -b --noEmit && npx oxlint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "Render WhyCreatorsJoin after WhyNow"
```

---

### Task 6: Visual verification in the browser

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server and open the page**

Use the project's dev server (`npm run dev`) via the Browser pane, navigate to the local URL, and scroll to the new section.

- [ ] **Step 2: Confirm the entrance plays once**

Scroll the tag/heading/description into view; confirm the wipe-tag, character stagger, and word reveal play, matching the look of `WhyNow`/`Solution`.

- [ ] **Step 3: Confirm the pinned scrub behavior**

Continue scrolling through the section: confirm the stage pins, slide 1's layer (bag image, "Brands ready to scale through creators", 2 green icons) fully fades out before slide 2's layer (tablet+pouch, "Creators building trust and long-term income" on the right, 2 violet icons) fades in, then slide 2 fades out before slide 3 (toaster+phones, "Partners shaping where commerce is headed", 2 yellow icons) fades in. Confirm scrolling back up reverses correctly and release-snap lands on a whole slide, never mid-fade.

- [ ] **Step 4: Check responsive scaling**

Resize the viewport (1280px, 1024px, 768px, 480px breakpoints) and confirm the canvas scales down without overflow or clipping, matching `OurPlatform`'s behavior at the same breakpoints.

- [ ] **Step 5: Report findings**

If any visual issue is found (position drift, overlap during transition, clipping), fix it in `WhyCreatorsJoin.module.css`/`slides.ts` and re-verify from Step 2. Once clean, take a screenshot and share it.
