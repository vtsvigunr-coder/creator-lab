export function sortLogoPaths(paths: SVGPathElement[]): SVGPathElement[] {
  return [...paths].sort((a, b) => a.getBBox().x - b.getBBox().x)
}
