import { describe, expect, it } from 'vitest'
import { layoutTextOnArc } from './layoutTextOnArc'

// A fixed-width stub keeps the expected angles easy to reason about.
const uniform = () => 10

describe('layoutTextOnArc', () => {
  it('centres the run on the top of the circle', () => {
    const chars = layoutTextOnArc('ABCD', 100, uniform)
    const first = chars[0].angle
    const last = chars[chars.length - 1].angle
    expect(first).toBeCloseTo(-last, 10)
  })

  it('steps by glyph width over radius', () => {
    const chars = layoutTextOnArc('AB', 100, uniform)
    expect(chars[1].angle - chars[0].angle).toBeCloseTo(0.1, 10)
  })

  it('gives wider glyphs more of the arc', () => {
    const widths: Record<string, number> = { I: 4, M: 20 }
    const chars = layoutTextOnArc('IMI', 100, (c) => widths[c])
    // The two I's sit symmetrically around the wide M in the middle.
    expect(chars[1].angle).toBeCloseTo(0, 10)
    expect(chars[0].angle).toBeCloseTo(-chars[2].angle, 10)
    expect(Math.abs(chars[0].angle)).toBeCloseTo(0.12, 10)
  })
})
