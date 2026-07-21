// Shared soft-blur reveal timing, used verbatim by every section that staggers in
// `[data-soft-blur-char]` heading units — so tuning it once keeps every section in sync.
export const CHAR_STAGGER = 0.025
export const CHAR_START = 0.25
export const SOFT_BLUR = {
  opacity: 0,
  y: 16,
  filter: 'blur(12px)',
  duration: 0.9,
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
}
