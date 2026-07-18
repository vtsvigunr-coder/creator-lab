import { splitWords } from './splitWords'

test('splits text into words, flagging whitespace runs', () => {
  expect(splitWords('Hi there you')).toEqual([
    { word: 'Hi', isSpace: false },
    { word: ' ', isSpace: true },
    { word: 'there', isSpace: false },
    { word: ' ', isSpace: true },
    { word: 'you', isSpace: false },
  ])
})
