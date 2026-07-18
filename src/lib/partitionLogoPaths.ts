export function partitionLogoPaths(
  sortedPaths: SVGPathElement[],
  markMaxX = 20,
): { markPaths: SVGPathElement[]; letterPaths: SVGPathElement[] } {
  const markPaths = sortedPaths.filter((p) => p.getBBox().x < markMaxX)
  const letterPaths = sortedPaths.filter((p) => p.getBBox().x >= markMaxX)
  return { markPaths, letterPaths }
}
