import { sortLogoPaths } from './sortLogoPaths'

function fakePath(x: number): SVGPathElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGPathElement
  el.getBBox = () => ({ x, y: 0, width: 1, height: 1 }) as DOMRect
  return el
}

test('sorts paths left to right by bounding-box x', () => {
  const rightmost = fakePath(135)
  const leftmost = fakePath(25)
  const middle = fakePath(75)
  expect(sortLogoPaths([rightmost, leftmost, middle])).toEqual([leftmost, middle, rightmost])
})
