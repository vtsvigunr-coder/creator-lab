import { useMemo } from 'react'
import { splitChars } from '../lib/splitChars'
import { splitWords } from '../lib/splitWords'
import styles from './AnimatedText.module.css'

/**
 * Per-character units for the soft-blur heading reveal (same treatment as the hero title).
 *
 * Each character is its own inline-block, which on its own would let the browser break a line
 * between any two letters. So the characters of a word are wrapped in an inline-block group —
 * a group is unbreakable — and the spaces between groups stay real, breakable spaces. Every
 * character (spaces included) is still one `[data-soft-blur-char]` unit in DOM order, so the
 * stagger timings are unchanged.
 */
export function AnimatedChars({ text }: { text: string }) {
  const chars = useMemo(() => splitChars(text), [text])
  const out: React.ReactNode[] = []
  let word: React.ReactNode[] = []

  const flush = (key: number) => {
    if (word.length === 0) return
    out.push(
      <span key={`w${key}`} className={styles.charGroup}>
        {word}
      </span>,
    )
    word = []
  }

  chars.forEach((c, i) => {
    if (c.isSpace) {
      flush(i)
      out.push(
        <span key={i} data-soft-blur-char>
          {' '}
        </span>,
      )
      return
    }
    word.push(
      <span key={i} className={styles.charUnit} data-soft-blur-char>
        {c.char}
      </span>,
    )
  })
  flush(chars.length)

  return <>{out}</>
}

/** Per-word units for the body-copy reveal. Spaces stay unwrapped so the text still wraps. */
export function AnimatedWords({ text }: { text: string }) {
  const words = useMemo(() => splitWords(text), [text])
  return (
    <>
      {words.map((w, i) =>
        w.isSpace ? (
          <span key={i}>{w.word}</span>
        ) : (
          <span key={i} className={styles.wordUnit} data-desc-word>
            {w.word}
          </span>
        ),
      )}
    </>
  )
}
