import { buildLoopList } from './buildLoopList'

test('duplicates the list once for a seamless loop', () => {
  expect(buildLoopList(['a', 'b', 'c'])).toEqual(['a', 'b', 'c', 'a', 'b', 'c'])
})
