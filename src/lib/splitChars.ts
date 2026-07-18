export function splitChars(text: string): { char: string; isSpace: boolean }[] {
  return Array.from(text).map((char) => ({ char, isSpace: char === ' ' }))
}
