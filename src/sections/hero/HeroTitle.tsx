import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { splitChars } from '../../lib/splitChars'
import { splitWords } from '../../lib/splitWords'
import styles from './HeroTitle.module.css'

const NBSP = ' '

const LINE_1 = 'The operating system'
const LINE_2 = 'for creator-led commerce'
const DESCRIPTION =
  'Creator Lab helps brands sell through creators, and helps creators earn through trackable products, links, payouts, and performance'

function AnimatedChars({ text }: { text: string }) {
  const chars = useMemo(() => splitChars(text), [text])
  return (
    <>
      {chars.map((c, i) => (
        <span key={i} className={styles.charUnit} data-soft-blur-char>
          {c.isSpace ? NBSP : c.char}
        </span>
      ))}
    </>
  )
}

function AnimatedDescription({ text }: { text: string }) {
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

export default function HeroTitle() {
  const rootRef = useRef<HTMLDivElement>(null)
  const markerFillRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const markerFill = markerFillRef.current
    if (!root || !markerFill) return

    const chars = root.querySelectorAll('[data-soft-blur-char]')
    const words = root.querySelectorAll('[data-desc-word]')
    const stagger = 0.025
    const charDuration = 0.9

    // The marker fill should start growing once "Uzbekistan"'s own characters have finished
    // revealing, not the whole heading — so its start time is derived from that word's own
    // last character landing, rather than chained after every other line in the heading.
    const markerChars = markerFill.parentElement!.querySelectorAll('[data-soft-blur-char]')
    const markerStart =
      Array.from(chars).indexOf(markerChars[markerChars.length - 1]) * stagger + charDuration

    const tl = gsap.timeline()

    tl.from(
      chars,
      {
        opacity: 0,
        y: 16,
        filter: 'blur(12px)',
        duration: charDuration,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        stagger,
      },
      0,
    )
      .to(markerFill, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, markerStart)
      .from(
        words,
        {
          opacity: 0,
          y: 10,
          filter: 'blur(8px)',
          duration: 0.6,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          stagger: 0.03,
        },
        0,
      )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className={styles.wrap} data-testid="hero-title" ref={rootRef}>
      <div className={styles.headingBlock}>
        <h1 className={styles.heading}>
          <div>
            <AnimatedChars text={LINE_1} />
          </div>
          <div>
            <AnimatedChars text={LINE_2} />
          </div>
          <div className={styles.highlightRow}>
            <span className={styles.inWord}>
              <AnimatedChars text="in" />
            </span>
            <div className={styles.markerBox} data-testid="uzbekistan-marker">
              <div className={styles.markerFill} ref={markerFillRef} />
              <span className={styles.markerText}>
                <AnimatedChars text="Uzbekistan" />
              </span>
            </div>
          </div>
        </h1>
      </div>
      <p className={styles.description}>
        <AnimatedDescription text={DESCRIPTION} />
      </p>
    </div>
  )
}
