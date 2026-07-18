import { splitChars } from './splitChars'

test('splits text into characters, flagging spaces', () => {
  expect(splitChars('Hi there')).toEqual([
    { char: 'H', isSpace: false },
    { char: 'i', isSpace: false },
    { char: ' ', isSpace: true },
    { char: 't', isSpace: false },
    { char: 'h', isSpace: false },
    { char: 'e', isSpace: false },
    { char: 'r', isSpace: false },
    { char: 'e', isSpace: false },
  ])
})
