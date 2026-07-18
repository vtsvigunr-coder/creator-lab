import { partitionLogoPaths } from './partitionLogoPaths'

function fakePath(x: number): SVGPathElement {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGPathElement
  el.getBBox = () => ({ x, y: 0, width: 1, height: 1 }) as DOMRect
  return el
}

test('splits the mark (small x) from the letters (larger x)', () => {
  const mark1 = fakePath(0)
  const mark2 = fakePath(8)
  const letterC = fakePath(25)
  const letterB = fakePath(135)
  const { markPaths, letterPaths } = partitionLogoPaths([mark1, mark2, letterC, letterB])
  expect(markPaths).toEqual([mark1, mark2])
  expect(letterPaths).toEqual([letterC, letterB])
})
