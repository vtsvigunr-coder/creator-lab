import { useLayoutEffect, useState } from 'react'
import { layoutTextOnArc, type ArcChar } from '../../lib/layoutTextOnArc'
import styles from './CurvedLabel.module.css'

const FONT = '700 32px "Gabarito", system-ui, sans-serif'
// Extra air between glyphs, in px of arc — matches the tracking in the design.
const TRACKING = 2

let sharedCanvas: CanvasRenderingContext2D | null = null
function measurer() {
  if (!sharedCanvas) sharedCanvas = document.createElement('canvas').getContext('2d')
  if (!sharedCanvas) return null
  sharedCanvas.font = FONT
  return sharedCanvas
}

/**
 * The label that curves around the top of the main circle. Each glyph is its own element —
 * rather than an SVG textPath — so the switch animation can blur and lift them one by one.
 */
export default function CurvedLabel({
  text,
  radius,
  size,
}: {
  text: string
  radius: number
  size: number
}) {
  const [chars, setChars] = useState<ArcChar[]>([])

  // Layout, not effect: the label is mounted mid-switch, and measuring after the first paint
  // would leave it blank for a frame just as it starts moving.
  useLayoutEffect(() => {
    let cancelled = false
    // Glyph widths are only meaningful once the webfont itself has loaded; measuring against
    // the fallback would space the letters for the wrong typeface.
    const place = () => {
      const ctx = measurer()
      if (!ctx || cancelled) return
      setChars(layoutTextOnArc(text.toUpperCase(), radius, (c) => ctx.measureText(c).width + TRACKING))
    }
    place()
    document.fonts?.ready.then(place)
    return () => {
      cancelled = true
    }
  }, [text, radius])

  const centre = size / 2

  return (
    <div className={styles.wrap} aria-hidden>
      {chars.map(({ char, angle }, i) => (
        <span
          key={`${text}-${i}`}
          className={styles.char}
          data-arc-char
          style={{
            transform: `translate(-50%, -50%) translate(${centre + radius * Math.sin(angle)}px, ${
              centre - radius * Math.cos(angle)
            }px) rotate(${angle}rad)`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
