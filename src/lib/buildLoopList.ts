export function buildLoopList<T>(items: T[]): T[] {
  return [...items, ...items]
}
