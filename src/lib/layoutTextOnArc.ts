export type ArcChar = {
  char: string
  /** Angle from the top of the circle, in radians; negative is anti-clockwise. */
  angle: number
}

/**
 * Spreads text along the top of a circle, centred on 12 o'clock. Each character is placed by
 * arc length, so the spacing follows the real glyph widths instead of a uniform step — that
 * is what keeps a word like "PLATFORM" from looking gappy around the I and tight around the M.
 */
export function layoutTextOnArc(
  text: string,
  radius: number,
  measure: (char: string) => number,
): ArcChar[] {
  const widths = Array.from(text).map(measure)
  const total = widths.reduce((sum, w) => sum + w, 0)

  let travelled = 0
  return Array.from(text).map((char, i) => {
    // Anchor on the centre of each glyph: half of the ones already laid down, plus half of
    // this one, measured out from the start of the whole run.
    const centre = travelled + widths[i] / 2
    travelled += widths[i]
    return { char, angle: (centre - total / 2) / radius }
  })
}
