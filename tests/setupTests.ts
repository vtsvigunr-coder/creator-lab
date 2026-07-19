import '@testing-library/jest-dom'

if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (!SVGElement.prototype.getBBox) {
  // @ts-expect-error jsdom does not implement SVG layout
  SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 })
}

// jsdom does no layout, so every element measures 0x0. ScrollTrigger then computes an `end`
// of 0 for every trigger, and GSAP treats a falsy `end` as "not initialised yet" and forces a
// nested refresh from inside its own refresh loop — which mutates the trigger array it is
// midway through iterating and blows up on the next index. Handing out a plausible viewport
// box keeps `end` truthy, so the triggers initialise normally instead. Without this, mounting
// more than a handful of scroll-driven sections at once throws.
const REAL_RECT = Element.prototype.getBoundingClientRect
Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element) {
  const rect = REAL_RECT.call(this)
  if (rect.width || rect.height) return rect
  return { x: 0, y: 0, top: 0, left: 0, right: 1200, bottom: 800, width: 1200, height: 800, toJSON: () => ({}) } as DOMRect
}

if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
