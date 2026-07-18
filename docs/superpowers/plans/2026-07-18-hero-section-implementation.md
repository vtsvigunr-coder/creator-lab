# Hero Section + Menu Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Creative Lab Vite+React+TS app and implement the Figma Hero section (closed + open menu states) with the full GSAP/Lenis entrance-animation sequence described in the design spec.

**Architecture:** Vite React TS app. Lenis drives smooth scroll, bridged into a shared GSAP ticker/ScrollTrigger proxy (`src/lib/gsap.ts`, `src/lib/useLenis.ts`). The Hero is composed of small, independently-testable components (`AnimatedLogo`, `HeroTitle`, `CircleRevealButton`/`HeroButtons`, `CardMarquee`, `Header`/`MenuOverlay`), each owning one GSAP timeline; `Hero.tsx` sequences them into one master timeline that plays once on mount after fonts are ready.

**Tech Stack:** Vite, React 18, TypeScript, GSAP (+ ScrollTrigger), Lenis, vite-plugin-svgr, Vitest + @testing-library/react for logic/smoke tests.

## Global Constraints

- Figma source: file `G6icdiLONcBVlcExTmlykd`, nodes `1190-23928` (menu closed) / `1190-24292` (menu open) — one Hero component, two menu states.
- Do not install Tailwind — use plain CSS Modules.
- Card order (left→right): `Img.png`, `Dyson.svg`, `Img-1.png`, `Img-2.png`, `xlash.png`, `Img-3.png`, `weekday.png`, `Img-4.png`.
- Colors: `--dark-gray:#1E1E1E`, `--white:#FFFFFF`, `--gray:#808080`, `--gray-200:#E8E8E8`, `--gray-300:#D9D9D9`, `--pink-200:#FFA7CF`, `--violet-400:#4C2261`, `--mint-100:#C2F1CE`, `--violet-200:#D0BDFC`, `--blue-200:#B4D7FF`, `--dark-purple:#21143B`, menu overlay `rgba(0,0,0,0.36)`.
- Font: Pretendard Variable, self-hosted, `font-display: swap`.
- Every animated text/letter wrapper: `overflow: visible`, no ancestor `overflow: hidden` on the animating axis, line-height/padding sized to the effect's max blur radius + translate distance.
- Whole entrance sequence plays once, automatically, on load (after `document.fonts.ready`) — not scroll-triggered.
- `soft-blur-in` enter values (from animate-text skill): duration 900ms, stagger 25ms, easing `cubic-bezier(0.22,1,0.36,1)`, from `{opacity:0, y:16px, blur:12px}` to `{opacity:1, y:0, blur:0}`.
- `top-down-letters` enter values: duration 400ms, stagger 88ms, easing `cubic-bezier(0.18,1,0.32,1)`, from `{opacity:0, y:-46px}` to `{opacity:1, y:0}` — scaled down to `y:-14px` for the small logo per the effect's own "if motion feels too tall" fallback.

---

## File Structure

```
package.json, vite.config.ts, tsconfig.json
public/                                (none needed; assets are imported)
src/
  main.tsx, App.tsx, App.module.css
  lib/
    gsap.ts
    useLenis.ts
    splitChars.ts
    sortLogoPaths.ts
    buildLoopList.ts
  styles/
    fonts.css, tokens.css, reset.css
  assets/
    fonts/Pretendard-Variable.ttf
    images/{Img.png,Img-1.png,Img-2.png,Img-3.png,Img-4.png,Dyson.svg,xlash.png,weekday.png,Logo.svg}
    icons/{menu-04.svg,close-icon.svg,user.svg,x.svg,instagram.svg,telegram.svg,shopping-basket-favorite-03.svg,computer-video.svg,linkedin.svg}
  sections/hero/
    Hero.tsx, Hero.module.css
    Header.tsx, Header.module.css
    AnimatedLogo.tsx, AnimatedLogo.module.css
    HeroTitle.tsx, HeroTitle.module.css
    CircleRevealButton.tsx, CircleRevealButton.module.css
    HeroButtons.tsx
    CardMarquee.tsx, CardMarquee.module.css
    MenuOverlay.tsx, MenuOverlay.module.css
tests/setupTests.ts
```

---

### Task 1: Scaffold the Vite + React + TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/App.module.css`
- Test: `tests/setupTests.ts`, `src/App.test.tsx`

**Interfaces:**
- Produces: `<App />` default export from `src/App.tsx`, rendering a placeholder `<div data-testid="app-root">Creative Lab</div>` for now (Hero wiring comes in Task 10).

- [ ] **Step 1: Scaffold Vite**

```bash
npm create vite@latest . -- --template react-ts
```
When prompted about the non-empty directory, confirm proceeding (existing `font/`, `main page/`, `.agents/`, `.claude/`, `docs/` stay untouched — Vite only adds its own files).

- [ ] **Step 2: Install animation + tooling deps**

```bash
npm install gsap lenis
npm install -D vite-plugin-svgr vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 3: Configure `vite.config.ts` for SVGR + Vitest**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    globals: true,
  },
})
```

- [ ] **Step 4: Add test setup file**

`tests/setupTests.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Replace `src/App.tsx` with a placeholder and write the smoke test**

`src/App.tsx`:

```tsx
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.root} data-testid="app-root">
      Creative Lab
    </div>
  )
}
```

`src/App.module.css`:

```css
.root {
  min-height: 100vh;
}
```

`src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the app root', () => {
  render(<App />)
  expect(screen.getByTestId('app-root')).toBeInTheDocument()
})
```

- [ ] **Step 6: Run the test suite**

Run: `npx vitest run`
Expected: `1 passed`

- [ ] **Step 7: Verify the dev server boots**

Run: `npm run dev -- --port 5173` (background), then confirm `http://localhost:5173` returns the placeholder text via the browser tool or `curl -s http://localhost:5173 | grep -q root`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html .gitignore src tests
git commit -m "Scaffold Vite + React + TS app with vitest and svgr"
```

---

### Task 2: Global styles — fonts, tokens, reset

**Files:**
- Create: `src/assets/fonts/Pretendard-Variable.ttf` (copied), `src/styles/fonts.css`, `src/styles/tokens.css`, `src/styles/reset.css`
- Modify: `src/main.tsx` (import the three style files)

**Interfaces:**
- Produces: CSS custom properties on `:root` (`--color-dark-gray`, `--color-white`, `--color-gray`, `--color-gray-200`, `--color-gray-300`, `--color-pink-200`, `--color-violet-400`, `--color-mint-100`, `--color-violet-200`, `--color-blue-200`, `--color-dark-purple`, `--overlay-scrim`) and a `--font-sans` variable, consumed by every later component's CSS module.

- [ ] **Step 1: Copy the font file**

```bash
mkdir -p src/assets/fonts
cp "font/Pretendard Variable.ttf" "src/assets/fonts/Pretendard-Variable.ttf"
```

- [ ] **Step 2: Write `src/styles/fonts.css`**

```css
@font-face {
  font-family: 'Pretendard Variable';
  src: url('../assets/fonts/Pretendard-Variable.ttf') format('truetype-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Write `src/styles/tokens.css`**

```css
:root {
  --color-dark-gray: #1e1e1e;
  --color-white: #ffffff;
  --color-gray: #808080;
  --color-gray-200: #e8e8e8;
  --color-gray-300: #d9d9d9;
  --color-pink-200: #ffa7cf;
  --color-violet-400: #4c2261;
  --color-mint-100: #c2f1ce;
  --color-violet-200: #d0bdfc;
  --color-blue-200: #b4d7ff;
  --color-dark-purple: #21143b;
  --overlay-scrim: rgba(0, 0, 0, 0.36);
  --font-sans: 'Pretendard Variable', system-ui, sans-serif;
}
```

- [ ] **Step 4: Write `src/styles/reset.css`**

```css
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; }
body {
  font-family: var(--font-sans);
  background: var(--color-white);
  color: var(--color-dark-gray);
  -webkit-font-smoothing: antialiased;
}
button { font: inherit; cursor: pointer; }
img { display: block; max-width: 100%; }
```

- [ ] **Step 5: Wire the imports into `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/tokens.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Verify the build still passes**

Run: `npx vitest run`
Expected: `1 passed` (unchanged from Task 1 — this task is style-only, no new test).

- [ ] **Step 7: Commit**

```bash
git add src/styles src/assets/fonts src/main.tsx
git commit -m "Add self-hosted font, design tokens, and CSS reset"
```

---

### Task 3: Migrate image/icon assets

**Files:**
- Create: `src/assets/images/*`, `src/assets/icons/*` (copied from `main page/picture` and `main page/icon`)

**Interfaces:**
- Produces: importable asset paths used by Tasks 5, 7–9 (e.g. `import img from '../../assets/images/Img.png'`, `import Logo from '../../assets/images/Logo.svg?react'`).

- [ ] **Step 1: Copy images**

```bash
mkdir -p src/assets/images src/assets/icons
cp "main page/picture/Img.png" "main page/picture/Img-1.png" "main page/picture/Img-2.png" \
   "main page/picture/Img-3.png" "main page/picture/Img-4.png" "main page/picture/Dyson.svg" \
   "main page/picture/xlash.png" "main page/picture/weekday.png" "main page/picture/Logo.svg" \
   src/assets/images/
```

- [ ] **Step 2: Copy icons**

```bash
cp "main page/icon/menu-04.svg" "main page/icon/close-icon.svg" "main page/icon/user.svg" \
   "main page/icon/x.svg" "main page/icon/instagram.svg" "main page/icon/telegram.svg" \
   "main page/icon/linkedin.svg" "main page/icon/shopping-basket-favorite-03.svg" \
   "main page/icon/computer-video.svg" \
   src/assets/icons/
```

- [ ] **Step 3: Strip the Figma dev-annotation rect from the copied `Logo.svg`**

Open `src/assets/images/Logo.svg` and delete the dashed guide rect line (the `<rect ... stroke="#E8E8E8" ... stroke-dasharray="0.75 0.75"/>` immediately before `<defs>`) — it's a Figma redline annotation, not part of the real mark. Leave the two mark `<path>`s and ten letter `<path>`s untouched.

- [ ] **Step 4: Verify files are present**

Run: `ls src/assets/images src/assets/icons`
Expected: 9 files in `images/`, 9 files in `icons/`.

- [ ] **Step 5: Commit**

```bash
git add src/assets/images src/assets/icons
git commit -m "Migrate hero images and icons into src/assets"
```

---

### Task 4: GSAP + Lenis bridge

**Files:**
- Create: `src/lib/gsap.ts`, `src/lib/useLenis.ts`, `src/lib/useLenis.test.ts`

**Interfaces:**
- Produces: `gsap` (configured, `ScrollTrigger` registered) and `ScrollTrigger` re-exported from `src/lib/gsap.ts`; `useLenis(): void` hook from `src/lib/useLenis.ts` that instantiates Lenis, drives it from `gsap.ticker`, and syncs `ScrollTrigger`.
- Consumed by: `App.tsx` (Task 10, calls `useLenis()` once) and every timeline-owning component (imports `gsap` from `src/lib/gsap.ts`, never the raw `gsap` package, so registration always happens first).

- [ ] **Step 1: Write `src/lib/gsap.ts`**

```ts
import gsapCore from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsapCore.registerPlugin(ScrollTrigger)

export const gsap = gsapCore
export { ScrollTrigger }
```

- [ ] **Step 2: Write the failing test for the Lenis/GSAP bridge**

`src/lib/useLenis.test.ts`:

```ts
import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useLenis } from './useLenis'

vi.mock('lenis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      raf: vi.fn(),
      on: vi.fn(),
      destroy: vi.fn(),
    })),
  }
})

test('instantiates Lenis once and registers a raf ticker callback', () => {
  const { unmount } = renderHook(() => useLenis())
  const Lenis = require('lenis').default
  expect(Lenis).toHaveBeenCalledTimes(1)
  unmount()
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/useLenis.test.ts`
Expected: FAIL — `useLenis` does not exist yet.

- [ ] **Step 4: Implement `src/lib/useLenis.ts`**

```ts
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/useLenis.test.ts`
Expected: `1 passed`

- [ ] **Step 6: Commit**

```bash
git add src/lib/gsap.ts src/lib/useLenis.ts src/lib/useLenis.test.ts
git commit -m "Add GSAP/Lenis scroll bridge"
```

---

### Task 5: Text-splitting and logo-ordering utilities

**Files:**
- Create: `src/lib/splitChars.ts`, `src/lib/splitChars.test.ts`, `src/lib/sortLogoPaths.ts`, `src/lib/sortLogoPaths.test.ts`

**Interfaces:**
- Produces: `splitChars(text: string): { char: string; isSpace: boolean }[]` — consumed by `HeroTitle.tsx` (Task 6).
- Produces: `sortLogoPaths(paths: SVGPathElement[]): SVGPathElement[]` — sorts by each path's bounding-box `x` ascending (left→right reading order), consumed by `AnimatedLogo.tsx` (Task 6... actually Task 5b below).

- [ ] **Step 1: Write the failing test for `splitChars`**

`src/lib/splitChars.test.ts`:

```ts
import { splitChars } from './splitChars'

test('splits text into characters, flagging spaces', () => {
  expect(splitChars('Hi there')).toEqual([
    { char: 'H', isSpace: false },
    { char: 'i', isSpace: false },
    { char: ' ', isSpace: true },
    { char: 't', isSpace: false },
    { char: 'h', isSpace: false },
    { char: 'e', isSpace: false },
    { char: 'r', isSpace: false },
    { char: 'e', isSpace: false },
  ])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/splitChars.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/splitChars.ts`**

```ts
export function splitChars(text: string): { char: string; isSpace: boolean }[] {
  return Array.from(text).map((char) => ({ char, isSpace: char === ' ' }))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/splitChars.test.ts`
Expected: `1 passed`

- [ ] **Step 5: Write the failing test for `sortLogoPaths`**

`src/lib/sortLogoPaths.test.ts`:

```ts
import { sortLogoPaths } from './sortLogoPaths'

function fakePath(x: number): SVGPathElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  vi.spyOn(el, 'getBBox').mockReturnValue({ x, y: 0, width: 1, height: 1 } as DOMRect)
  return el
}

test('sorts paths left to right by bounding-box x', () => {
  const rightmost = fakePath(135)
  const leftmost = fakePath(25)
  const middle = fakePath(75)
  expect(sortLogoPaths([rightmost, leftmost, middle])).toEqual([leftmost, middle, rightmost])
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/lib/sortLogoPaths.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `src/lib/sortLogoPaths.ts`**

```ts
export function sortLogoPaths(paths: SVGPathElement[]): SVGPathElement[] {
  return [...paths].sort((a, b) => a.getBBox().x - b.getBBox().x)
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/lib/sortLogoPaths.test.ts`
Expected: `1 passed`

- [ ] **Step 9: Commit**

```bash
git add src/lib/splitChars.ts src/lib/splitChars.test.ts src/lib/sortLogoPaths.ts src/lib/sortLogoPaths.test.ts
git commit -m "Add splitChars and sortLogoPaths utilities"
```

---

### Task 6: `AnimatedLogo` — top-down-letters reveal

**Files:**
- Create: `src/sections/hero/AnimatedLogo.tsx`, `src/sections/hero/AnimatedLogo.module.css`, `src/sections/hero/AnimatedLogo.test.tsx`

**Interfaces:**
- Consumes: `sortLogoPaths` from `src/lib/sortLogoPaths.ts`, `gsap` from `src/lib/gsap.ts`, `Logo.svg` from `src/assets/images/Logo.svg?react` (SVGR component, exposing `ref` to the root `<svg>`).
- Produces: `AnimatedLogo({ onComplete?: () => void }): JSX.Element` default export. Exposes the root element with `data-testid="animated-logo"`. Calls `onComplete` once the reveal timeline finishes — consumed by `Hero.tsx` (Task 10) to sequence the title next.

- [ ] **Step 1: Write the smoke test**

`src/sections/hero/AnimatedLogo.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import AnimatedLogo from './AnimatedLogo'

test('renders the logo mark and ten letter paths', () => {
  render(<AnimatedLogo />)
  const logo = screen.getByTestId('animated-logo')
  expect(logo.querySelectorAll('path').length).toBe(12)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/hero/AnimatedLogo.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `AnimatedLogo.module.css`**

```css
.host {
  overflow: visible;
  padding-top: 16px;
  margin-top: -16px;
  width: 144px;
}
.host :global(svg) {
  overflow: visible;
  display: block;
}
```

- [ ] **Step 4: Implement `AnimatedLogo.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import Logo from '../../assets/images/Logo.svg?react'
import { gsap } from '../../lib/gsap'
import { sortLogoPaths } from '../../lib/sortLogoPaths'
import styles from './AnimatedLogo.module.css'

type AnimatedLogoProps = {
  onComplete?: () => void
}

export default function AnimatedLogo({ onComplete }: AnimatedLogoProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const paths = sortLogoPaths(Array.from(host.querySelectorAll('path')))
    const tl = gsap.timeline({ onComplete })

    tl.from(paths, {
      y: -14,
      opacity: 0,
      duration: 0.4,
      ease: 'cubic-bezier(0.18, 1, 0.32, 1)',
      stagger: 0.088,
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={hostRef} className={styles.host} data-testid="animated-logo">
      <Logo />
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/hero/AnimatedLogo.test.tsx`
Expected: `1 passed`

- [ ] **Step 6: Commit**

```bash
git add src/sections/hero/AnimatedLogo.tsx src/sections/hero/AnimatedLogo.module.css src/sections/hero/AnimatedLogo.test.tsx
git commit -m "Add AnimatedLogo with top-down-letters reveal"
```

---

### Task 7: `HeroTitle` — soft-blur-in title + pink marker reveal

**Files:**
- Create: `src/sections/hero/HeroTitle.tsx`, `src/sections/hero/HeroTitle.module.css`, `src/sections/hero/HeroTitle.test.tsx`

**Interfaces:**
- Consumes: `splitChars` from `src/lib/splitChars.ts`, `gsap` from `src/lib/gsap.ts`.
- Produces: `HeroTitle({ onComplete?: () => void }): JSX.Element` default export, `data-testid="hero-title"`. Calls `onComplete` after the pink-marker reveal finishes — consumed by `Hero.tsx` (Task 10) to sequence the buttons next.

- [ ] **Step 1: Write the smoke test**

`src/sections/hero/HeroTitle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import HeroTitle from './HeroTitle'

test('renders the title, highlighted word, and description', () => {
  render(<HeroTitle />)
  const title = screen.getByTestId('hero-title')
  expect(title).toHaveTextContent('The operating system')
  expect(title).toHaveTextContent('for creator-led commerce')
  expect(title).toHaveTextContent('Uzbekistan')
  expect(screen.getByTestId('uzbekistan-marker')).toBeInTheDocument()
  expect(title).toHaveTextContent(
    'Creator Lab helps brands sell through creators, and helps creators earn through trackable products, links, payouts, and performance',
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/hero/HeroTitle.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `HeroTitle.module.css`**

```css
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  overflow: visible;
}
.headingBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  overflow: visible;
}
.heading {
  font-weight: 800;
  font-size: 46px;
  line-height: 50px;
  letter-spacing: -0.92px;
  text-transform: uppercase;
  text-align: center;
  color: var(--color-dark-gray);
  overflow: visible;
  padding: 20px 0;
  margin: -20px 0;
}
.charUnit {
  display: inline-block;
  will-change: transform, filter, opacity;
}
.highlightRow {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}
.markerBox {
  background: var(--color-pink-200);
  border-radius: 4px;
  padding: 2px 24px;
  transform-origin: left center;
  transform: scaleX(0);
}
.description {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.42px;
  color: var(--color-gray);
  text-align: center;
  width: 441px;
  max-width: 90vw;
  overflow: visible;
  padding: 10px 0;
  margin: -10px 0;
}
```

- [ ] **Step 4: Implement `HeroTitle.tsx`**

```tsx
import { useEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { splitChars } from '../../lib/splitChars'
import styles from './HeroTitle.module.css'

type HeroTitleProps = {
  onComplete?: () => void
}

const LINE_1 = 'The operating system'
const LINE_2 = 'for creator-led commerce'
const DESCRIPTION =
  'Creator Lab helps brands sell through creators, and helps creators earn through trackable products, links, payouts, and performance'

function AnimatedChars({ text, className }: { text: string; className?: string }) {
  const chars = useMemo(() => splitChars(text), [text])
  return (
    <>
      {chars.map((c, i) => (
        <span
          key={i}
          className={`${styles.charUnit} ${className ?? ''}`}
          data-soft-blur-char
        >
          {c.isSpace ? ' ' : c.char}
        </span>
      ))}
    </>
  )
}

export default function HeroTitle({ onComplete }: HeroTitleProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const marker = markerRef.current
    if (!root || !marker) return

    const chars = root.querySelectorAll('[data-soft-blur-char]')
    const tl = gsap.timeline({ onComplete })

    tl.from(chars, {
      opacity: 0,
      y: 16,
      filter: 'blur(12px)',
      duration: 0.9,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
      stagger: 0.025,
    }).to(
      marker,
      {
        scaleX: 1,
        duration: 0.45,
        ease: 'power2.out',
      },
      '+=0',
    )

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div className={styles.wrap} data-testid="hero-title" ref={rootRef}>
      <div className={styles.headingBlock}>
        <h1 className={styles.heading}>
          <div>
            <AnimatedChars text={LINE_1} />
          </div>
          <div className={styles.highlightRow}>
            <AnimatedChars text={LINE_2 + ' in'} />
          </div>
          <div className={styles.highlightRow}>
            <div className={styles.markerBox} ref={markerRef} data-testid="uzbekistan-marker">
              <AnimatedChars text="Uzbekistan" />
            </div>
          </div>
        </h1>
        <p className={styles.description}>{DESCRIPTION}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/hero/HeroTitle.test.tsx`
Expected: `1 passed`

- [ ] **Step 6: Commit**

```bash
git add src/sections/hero/HeroTitle.tsx src/sections/hero/HeroTitle.module.css src/sections/hero/HeroTitle.test.tsx
git commit -m "Add HeroTitle with soft-blur-in reveal and pink marker sweep"
```

---

### Task 8: `CircleRevealButton` + `HeroButtons`

**Files:**
- Create: `src/sections/hero/CircleRevealButton.tsx`, `src/sections/hero/CircleRevealButton.module.css`, `src/sections/hero/CircleRevealButton.test.tsx`, `src/sections/hero/HeroButtons.tsx`

**Interfaces:**
- Produces: `CircleRevealButton({ label: string; icon?: string; variant: 'solid' | 'outline' | 'dark'; onReady?: (play: () => Promise<void>) => void }): JSX.Element` — the timeline is created but **paused**; the parent gets a `play()` handle via `onReady` so `HeroButtons`/`Hero.tsx` can sequence all three buttons together instead of each firing independently.
- Produces: `HeroButtons({ onComplete?: () => void }): JSX.Element` — plays all three `CircleRevealButton`s with a stagger, then calls `onComplete`. Consumed by `Hero.tsx` (Task 10).

- [ ] **Step 1: Write the smoke test**

`src/sections/hero/CircleRevealButton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import CircleRevealButton from './CircleRevealButton'

test('renders label and calls onReady with a play function', () => {
  let playFn: (() => Promise<void>) | undefined
  render(
    <CircleRevealButton
      label="Get Started"
      variant="dark"
      onReady={(play) => {
        playFn = play
      }}
    />,
  )
  expect(screen.getByText('Get Started')).toBeInTheDocument()
  expect(typeof playFn).toBe('function')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/hero/CircleRevealButton.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `CircleRevealButton.module.css`**

```css
.btn {
  --pill-height: 44px;
  height: var(--pill-height);
  width: var(--pill-height);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0;
  border: none;
  overflow: hidden;
  transform: scale(0);
  white-space: nowrap;
}
.solid { background: var(--color-violet-400); color: var(--color-white); }
.dark { background: var(--color-dark-gray); color: var(--color-white); }
.outline { background: transparent; color: var(--color-dark-gray); border: 1px solid var(--color-dark-gray); }
.icon { width: 20px; height: 20px; flex-shrink: 0; }
.label {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.48px;
  opacity: 0;
  transform: translateX(-8px);
}
```

- [ ] **Step 4: Implement `CircleRevealButton.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import styles from './CircleRevealButton.module.css'

type CircleRevealButtonProps = {
  label: string
  icon?: string
  variant: 'solid' | 'outline' | 'dark'
  onReady?: (play: () => Promise<void>) => void
}

export default function CircleRevealButton({ label, icon, variant, onReady }: CircleRevealButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    const label = labelRef.current
    if (!btn || !label) return

    const targetWidth = btn.scrollWidth
    const tl = gsap.timeline({ paused: true })

    tl.to(btn, { scale: 1, duration: 0.35, ease: 'back.out(1.7)' })
      .to(btn, { width: targetWidth, duration: 0.4, ease: 'power2.inOut' }, '-=0.05')
      .to(label, { opacity: 1, x: 0, duration: 0.3, ease: 'power1.out' }, '-=0.3')

    onReady?.(() => tl.play().then(() => {}))

    return () => {
      tl.kill()
    }
  }, [onReady])

  return (
    <button ref={btnRef} className={`${styles.btn} ${styles[variant]}`} type="button">
      {icon && <img src={icon} alt="" className={styles.icon} />}
      <span ref={labelRef} className={styles.label}>
        {label}
      </span>
    </button>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/hero/CircleRevealButton.test.tsx`
Expected: `1 passed`

- [ ] **Step 6: Implement `HeroButtons.tsx`**

```tsx
import { useRef } from 'react'
import CircleRevealButton from './CircleRevealButton'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'

type HeroButtonsProps = {
  onComplete?: () => void
}

export default function HeroButtons({ onComplete }: HeroButtonsProps) {
  const players = useRef<Array<() => Promise<void>>>([])
  const registered = useRef(0)

  const registerPlayer = (play: () => Promise<void>) => {
    players.current.push(play)
    registered.current += 1
    if (registered.current === 2) {
      Promise.all(players.current.map((p, i) => new Promise((r) => setTimeout(() => r(p()), i * 120)))).then(
        () => onComplete?.(),
      )
    }
  }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <CircleRevealButton label="Apply as a Brand" icon={basketIcon} variant="solid" onReady={registerPlayer} />
      <CircleRevealButton label="Apply as a Creator" icon={videoIcon} variant="outline" onReady={registerPlayer} />
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/sections/hero/CircleRevealButton.tsx src/sections/hero/CircleRevealButton.module.css src/sections/hero/CircleRevealButton.test.tsx src/sections/hero/HeroButtons.tsx
git commit -m "Add CircleRevealButton and HeroButtons"
```

---

### Task 9: `CardMarquee` — entrance stagger + infinite loop

**Files:**
- Create: `src/lib/buildLoopList.ts`, `src/lib/buildLoopList.test.ts`, `src/sections/hero/CardMarquee.tsx`, `src/sections/hero/CardMarquee.module.css`, `src/sections/hero/CardMarquee.test.tsx`

**Interfaces:**
- Produces: `buildLoopList<T>(items: T[]): T[]` — returns `[...items, ...items]` for a seamless duplicated track, consumed by `CardMarquee.tsx`.
- Produces: `CardMarquee({ onComplete?: () => void }): JSX.Element` default export, `data-testid="card-marquee"`. Calls `onComplete` once the entrance stagger finishes, then starts the infinite loop.

- [ ] **Step 1: Write the failing test for `buildLoopList`**

`src/lib/buildLoopList.test.ts`:

```ts
import { buildLoopList } from './buildLoopList'

test('duplicates the list once for a seamless loop', () => {
  expect(buildLoopList(['a', 'b', 'c'])).toEqual(['a', 'b', 'c', 'a', 'b', 'c'])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/buildLoopList.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/buildLoopList.ts`**

```ts
export function buildLoopList<T>(items: T[]): T[] {
  return [...items, ...items]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/buildLoopList.test.ts`
Expected: `1 passed`

- [ ] **Step 5: Write the smoke test for `CardMarquee`**

`src/sections/hero/CardMarquee.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import CardMarquee from './CardMarquee'

test('renders a duplicated, seamless card track', () => {
  render(<CardMarquee />)
  const marquee = screen.getByTestId('card-marquee')
  expect(marquee.querySelectorAll('[data-card]').length).toBe(16) // 8 cards x2 for the loop
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/sections/hero/CardMarquee.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement `CardMarquee.module.css`**

```css
.viewport {
  overflow: hidden;
  width: 100%;
}
.track {
  display: flex;
  gap: 16px;
  width: max-content;
}
.card {
  height: 220px;
  width: 189px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
  filter: blur(0);
}
.logoCard {
  height: 220px;
  width: 189px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 8: Implement `CardMarquee.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { buildLoopList } from '../../lib/buildLoopList'
import styles from './CardMarquee.module.css'

import img0 from '../../assets/images/Img.png'
import img1 from '../../assets/images/Img-1.png'
import img2 from '../../assets/images/Img-2.png'
import img3 from '../../assets/images/Img-3.png'
import img4 from '../../assets/images/Img-4.png'
import dyson from '../../assets/images/Dyson.svg'
import xlash from '../../assets/images/xlash.png'
import weekday from '../../assets/images/weekday.png'

type Card = { type: 'photo' | 'logo'; src: string; bg?: string }

const CARDS: Card[] = [
  { type: 'photo', src: img0 },
  { type: 'logo', src: dyson, bg: 'var(--color-mint-100)' },
  { type: 'photo', src: img1 },
  { type: 'photo', src: img2 },
  { type: 'logo', src: xlash, bg: 'var(--color-violet-200)' },
  { type: 'photo', src: img3 },
  { type: 'logo', src: weekday, bg: 'var(--color-blue-200)' },
  { type: 'photo', src: img4 },
]

type CardMarqueeProps = {
  onComplete?: () => void
}

export default function CardMarquee({ onComplete }: CardMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const loopCards = buildLoopList(CARDS)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const originalCards = track.querySelectorAll('[data-card]')
    const half = Array.from(originalCards).slice(0, CARDS.length)

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.()
        const loopWidth = track.scrollWidth / 2
        gsap.to(track, {
          x: -loopWidth,
          duration: 24,
          ease: 'none',
          repeat: -1,
        })
      },
    })

    tl.from(half, {
      opacity: 0,
      filter: 'blur(10px)',
      x: -24,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div className={styles.viewport} data-testid="card-marquee">
      <div className={styles.track} ref={trackRef}>
        {loopCards.map((card, i) =>
          card.type === 'photo' ? (
            <img key={i} src={card.src} className={styles.card} data-card alt="" />
          ) : (
            <div key={i} className={styles.logoCard} style={{ background: card.bg }} data-card>
              <img src={card.src} alt="" style={{ width: '60%' }} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run src/sections/hero/CardMarquee.test.tsx`
Expected: `1 passed`

- [ ] **Step 10: Commit**

```bash
git add src/lib/buildLoopList.ts src/lib/buildLoopList.test.ts src/sections/hero/CardMarquee.tsx src/sections/hero/CardMarquee.module.css src/sections/hero/CardMarquee.test.tsx
git commit -m "Add CardMarquee with entrance stagger and infinite loop"
```

---

### Task 10: `MenuOverlay` — Dynamic-Island pill/panel morph

**Files:**
- Create: `src/sections/hero/MenuOverlay.tsx`, `src/sections/hero/MenuOverlay.module.css`, `src/sections/hero/MenuOverlay.test.tsx`

**Interfaces:**
- Produces: `MenuOverlay({ open: boolean; onClose: () => void }): JSX.Element` default export, `data-testid="menu-overlay"`. Renders the pill trigger content when `open` is false and the expanded panel content when `open` is true, animating the transition with GSAP whenever `open` changes.
- Consumed by: `Header.tsx` (Task 11), which owns the `open` boolean state.

- [ ] **Step 1: Write the smoke test**

`src/sections/hero/MenuOverlay.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import MenuOverlay from './MenuOverlay'

test('shows sitemap links only when open, and calls onClose', () => {
  const onClose = vi.fn()
  const { rerender } = render(<MenuOverlay open={false} onClose={onClose} />)
  expect(screen.queryByText('How It Works')).not.toBeInTheDocument()

  rerender(<MenuOverlay open onClose={onClose} />)
  expect(screen.getByText('How It Works')).toBeInTheDocument()
  expect(screen.getByText('For Brands')).toBeInTheDocument()
  expect(screen.getByText('For Creators')).toBeInTheDocument()
  expect(screen.getByText('Pricing')).toBeInTheDocument()
  expect(screen.getByText('FAQ')).toBeInTheDocument()

  fireEvent.click(screen.getByText('Close'))
  expect(onClose).toHaveBeenCalledTimes(1)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/hero/MenuOverlay.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `MenuOverlay.module.css`**

```css
.panel {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -20px;
  border-radius: 8px;
  background: var(--overlay-scrim);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 8px 12px;
}
.trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-dark-gray);
  background: none;
  border: none;
  white-space: nowrap;
}
.closeRow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--color-white);
  background: none;
  border: none;
  width: 100%;
}
.body { display: flex; flex-direction: column; gap: 24px; width: 100%; opacity: 0; }
.group { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.groupTitle { color: var(--color-gray-200); font-size: 14px; }
.links { display: flex; flex-direction: column; gap: 8px; color: var(--color-white); font-weight: 600; text-transform: uppercase; }
.social { display: flex; gap: 16px; align-items: center; }
```

- [ ] **Step 4: Implement `MenuOverlay.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import styles from './MenuOverlay.module.css'
import menuIcon from '../../assets/icons/menu-04.svg'
import closeIcon from '../../assets/icons/close-icon.svg'
import instagramIcon from '../../assets/icons/instagram.svg'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import telegramIcon from '../../assets/icons/telegram.svg'

const SITEMAP = ['How It Works', 'For Brands', 'For Creators', 'Pricing', 'FAQ']
const LEGAL = ['Privacy Policy', 'Terms of Service', 'Cookie Policy']

type MenuOverlayProps = {
  open: boolean
  onClose: () => void
}

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closedSize = useRef({ width: 0, height: 0 })
  const openSize = useRef({ width: 320, height: 420 })

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (closedSize.current.width === 0) {
      closedSize.current = { width: panel.offsetWidth, height: panel.offsetHeight }
    }
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    const body = bodyRef.current
    if (!panel || !body) return

    if (open) {
      gsap
        .timeline()
        .to(panel, {
          width: openSize.current.width,
          height: openSize.current.height,
          borderRadius: 24,
          duration: 0.6,
          ease: 'elastic.out(1, 0.65)',
        })
        .to(body, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
    } else {
      gsap
        .timeline()
        .to(body, { opacity: 0, duration: 0.15, ease: 'power1.in' })
        .to(panel, {
          width: closedSize.current.width || 239,
          height: closedSize.current.height || 36,
          borderRadius: 60,
          duration: 0.4,
          ease: 'power2.inOut',
        })
    }
  }, [open])

  return (
    <div ref={panelRef} className={styles.panel} data-testid="menu-overlay">
      {!open && (
        <button className={styles.trigger} type="button" onClick={() => undefined}>
          <img src={menuIcon} alt="" width={20} height={20} />
          Menu
        </button>
      )}
      {open && (
        <>
          <button className={styles.closeRow} type="button" onClick={onClose}>
            <img src={closeIcon} alt="" width={20} height={20} />
            Close
          </button>
          <div className={styles.body} ref={bodyRef}>
            <div className={styles.group}>
              <span className={styles.groupTitle}>Sitemap</span>
              <div className={styles.links}>
                {SITEMAP.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className={styles.group}>
              <span className={styles.groupTitle}>Legal</span>
              <div className={styles.links}>
                {LEGAL.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className={styles.group}>
              <span className={styles.groupTitle}>Social</span>
              <div className={styles.social}>
                <img src={instagramIcon} alt="Instagram" width={20} height={20} />
                <img src={linkedinIcon} alt="LinkedIn" width={20} height={20} />
                <img src={telegramIcon} alt="Telegram" width={20} height={20} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/hero/MenuOverlay.test.tsx`
Expected: `1 passed`

- [ ] **Step 6: Commit**

```bash
git add src/sections/hero/MenuOverlay.tsx src/sections/hero/MenuOverlay.module.css src/sections/hero/MenuOverlay.test.tsx
git commit -m "Add MenuOverlay with Dynamic-Island pill/panel morph"
```

---

### Task 11: `Header`

**Files:**
- Create: `src/sections/hero/Header.tsx`, `src/sections/hero/Header.module.css`

**Interfaces:**
- Consumes: `AnimatedLogo` (Task 6), `MenuOverlay` (Task 10), `CircleRevealButton` (Task 8).
- Produces: `Header({ onLogoComplete?: () => void; onGetStartedReady?: (play: () => Promise<void>) => void }): JSX.Element` default export. Owns the `menuOpen` boolean state and toggles `MenuOverlay`.

- [ ] **Step 1: Implement `Header.module.css`**

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 120px 0;
  position: relative;
}
.right { display: flex; align-items: center; gap: 16px; }
.userBtn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid var(--color-gray-200);
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 2: Implement `Header.tsx`**

```tsx
import { useState } from 'react'
import AnimatedLogo from './AnimatedLogo'
import MenuOverlay from './MenuOverlay'
import CircleRevealButton from './CircleRevealButton'
import userIcon from '../../assets/icons/user.svg'
import styles from './Header.module.css'

type HeaderProps = {
  onLogoComplete?: () => void
  onGetStartedReady?: (play: () => Promise<void>) => void
}

export default function Header({ onLogoComplete, onGetStartedReady }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <AnimatedLogo onComplete={onLogoComplete} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className={styles.right}>
        <button className={styles.userBtn} type="button" onClick={() => setMenuOpen((v) => !v)}>
          <img src={userIcon} alt="Account" width={20} height={20} />
        </button>
        <CircleRevealButton label="Get Started" variant="dark" onReady={onGetStartedReady} />
      </div>
    </header>
  )
}
```

Note: the `MenuOverlay` trigger is visually centered per the Figma layout, but the open/close toggle is wired to the user-icon button for this task since `MenuOverlay`'s own trigger button is presentation-only (`onClick={() => undefined}` in Task 10). Wire the real toggle by passing `setMenuOpen` down: replace `onClick={() => undefined}` in `MenuOverlay.tsx`'s trigger button with an `onOpen` prop.

- [ ] **Step 3: Wire the real open toggle into `MenuOverlay`**

Modify `src/sections/hero/MenuOverlay.tsx`: add `onOpen: () => void` to `MenuOverlayProps`, and change the trigger button to `onClick={onOpen}`. Modify `Header.tsx`'s `<MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />` to also pass `onOpen={() => setMenuOpen(true)}`.

- [ ] **Step 4: Update `MenuOverlay.test.tsx`** to pass a no-op `onOpen={() => {}}` prop alongside `onClose` in both `render` and `rerender` calls.

- [ ] **Step 5: Run the full suite**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/sections/hero/Header.tsx src/sections/hero/Header.module.css src/sections/hero/MenuOverlay.tsx src/sections/hero/MenuOverlay.test.tsx
git commit -m "Add Header wiring logo, menu toggle, user button, and Get Started"
```

---

### Task 12: `Hero.tsx` master timeline + `App.tsx` wiring

**Files:**
- Create: `src/sections/hero/Hero.tsx`, `src/sections/hero/Hero.module.css`
- Modify: `src/App.tsx`, delete `src/App.test.tsx`'s now-stale assertion (update it — see Step 3)

**Interfaces:**
- Consumes: `Header`, `HeroTitle`, `HeroButtons`, `CardMarquee` and their `onComplete`/`onReady` callback props from Tasks 6–11.
- Produces: `Hero(): JSX.Element` default export, `data-testid="hero"`. Sequences: logo completes → title plays → title completes → buttons play (Get Started + the two Hero buttons together) → buttons complete → cards play.

- [ ] **Step 1: Implement `Hero.module.css`**

```css
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  padding-bottom: 80px;
  overflow: visible;
}
.centerBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-top: 96px;
}
```

- [ ] **Step 2: Implement `Hero.tsx`**

```tsx
import { useCallback, useRef, useState } from 'react'
import Header from './Header'
import HeroTitle from './HeroTitle'
import HeroButtons from './HeroButtons'
import CardMarquee from './CardMarquee'
import styles from './Hero.module.css'

export default function Hero() {
  const [titlePhase, setTitlePhase] = useState<'idle' | 'title' | 'buttons' | 'cards'>('idle')
  const getStartedPlay = useRef<(() => Promise<void>) | null>(null)

  const handleLogoComplete = useCallback(() => {
    setTitlePhase('title')
  }, [])

  const handleTitleComplete = useCallback(() => {
    setTitlePhase('buttons')
    getStartedPlay.current?.()
  }, [])

  const handleButtonsComplete = useCallback(() => {
    setTitlePhase('cards')
  }, [])

  return (
    <div className={styles.hero} data-testid="hero">
      <Header
        onLogoComplete={handleLogoComplete}
        onGetStartedReady={(play) => {
          getStartedPlay.current = play
        }}
      />
      <div className={styles.centerBlock}>
        {titlePhase !== 'idle' && <HeroTitle onComplete={handleTitleComplete} />}
        {(titlePhase === 'buttons' || titlePhase === 'cards') && (
          <HeroButtons onComplete={handleButtonsComplete} />
        )}
      </div>
      {titlePhase === 'cards' && <CardMarquee />}
    </div>
  )
}
```

- [ ] **Step 3: Wire `App.tsx` to render `Hero`**

```tsx
import { useLenis } from './lib/useLenis'
import Hero from './sections/hero/Hero'
import styles from './App.module.css'

export default function App() {
  useLenis()

  return (
    <div className={styles.root} data-testid="app-root">
      <Hero />
    </div>
  )
}
```

Update `src/App.test.tsx` to assert the Hero mounted instead of the old placeholder text:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the app root with the hero section', () => {
  render(<App />)
  expect(screen.getByTestId('app-root')).toBeInTheDocument()
  expect(screen.getByTestId('hero')).toBeInTheDocument()
})
```

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: all tests pass (no regressions from the `App.tsx` rewrite).

- [ ] **Step 5: Commit**

```bash
git add src/sections/hero/Hero.tsx src/sections/hero/Hero.module.css src/App.tsx src/App.test.tsx
git commit -m "Wire Hero master timeline sequencing and mount it from App"
```

---

### Task 13: Full visual verification pass

**Files:** none (verification only; fix forward in the files touched by Tasks 1–12 if issues are found).

- [ ] **Step 1: Start the dev server**

Use the browser preview tool to start `npm run dev` and open the served URL.

- [ ] **Step 2: Compare against the Figma screenshots**

Check header layout, title/description copy and sizing, pink "Uzbekistan" highlight, three buttons, and the 8-card row against the two screenshots captured during design (`1190-23928` closed / `1190-24292` open).

- [ ] **Step 3: Verify the entrance sequence**

Reload the page and confirm, in order: logo letters drop top-down without clipping → title characters blur in without clipping ascenders/descenders → pink marker sweeps left-to-right only after "Uzbekistan" finishes → Get Started + the two Hero buttons expand from circles with labels appearing mid-expansion → cards fade/blur in left-to-right → the card track then loops leftward continuously and seamlessly (no visible seam or jump).

- [ ] **Step 4: Verify the menu interaction**

Click the user-icon toggle: confirm the pill morphs into the panel with a visible bounce/overshoot (Dynamic-Island feel), the panel content (Sitemap, Legal, Social) fades/rises in after the morph, and clicking "Close" reverses cleanly (content fades out, panel collapses back to the pill).

- [ ] **Step 5: Fix any visual gaps found**

If spacing, sizing, or timing doesn't match the Figma reference or the spec's animation descriptions, adjust the relevant component/CSS module directly (no new files) and re-verify in the browser.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "Polish Hero visuals after browser verification pass"
```

(Skip this commit if Step 5 required no changes.)

---

## Self-Review Notes

- **Spec coverage:** stack/Lenis+GSAP bridge (Task 4), logo top-down-letters (Task 6), title soft-blur-in + pink marker sequencing (Task 7), 3-button circle reveal (Task 8), card entrance+marquee (Task 9), Dynamic-Island menu morph (Task 10), master sequencing on load (Task 12), anti-clipping CSS (Tasks 6–7), visual fidelity check (Task 13) — all covered.
- **Type consistency:** `onComplete`/`onReady`/`play(): Promise<void>` callback names match across `AnimatedLogo`, `HeroTitle`, `CircleRevealButton`, `HeroButtons`, `CardMarquee`, `Hero.tsx`.
- **Placeholder scan:** no TBD/TODO left; every step has literal code.
