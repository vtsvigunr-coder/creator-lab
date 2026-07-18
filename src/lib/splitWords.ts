export function splitWords(text: string): { word: string; isSpace: boolean }[] {
  return (text.match(/(\S+|\s+)/g) ?? []).map((word) => ({ word, isSpace: /^\s+$/.test(word) }))
}
