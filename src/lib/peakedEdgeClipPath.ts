// Shared shape for any section whose mask is a shallow peak with a rounded apex, blunted by
// a curve tangent to both slopes rather than meeting at a hard vertex — used by the Problem
// curtain and the CTA footer's arch.
export function clampApexRadius(width: number, desired: number) {
  return Math.min(desired, width / 2)
}

export function peakedEdgeClipPath(
  w: number,
  h: number,
  topY: number,
  peakY: number,
  shoulderY: number,
  r: number,
) {
  const half = w / 2
  return `path('M 0 ${topY} L ${half - r} ${shoulderY} Q ${half} ${peakY} ${half + r} ${shoulderY} L ${w} ${topY} L ${w} ${h} L 0 ${h} Z')`
}
