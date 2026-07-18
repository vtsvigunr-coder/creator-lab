import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { splitChars } from '../../lib/splitChars'
import styles from './HeroTitle.module.css'

type HeroTitleProps = {
  onComplete?: () => void
}

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
          {c.isSpace ? ' ' : c.char}
        </span>
      ))}
    </>
  )
}

export default function HeroTitle({ onComplete }: HeroTitleProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const marker = markerRef.current
    if (!root || !marker) return

    const chars = root.querySelectorAll('[data-soft-blur-char]')
    const tl = gsap.timeline({ onComplete })

    tl.from(chars, {
      opacity: 0,
      y: 16,
      filter: 'blur(12px)',
      duration: 0.9,
      ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
      stagger: 0.025,
    }).to(marker, {
      scaleX: 1,
      duration: 0.45,
      ease: 'power2.out',
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

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
            <AnimatedChars text="in" />
            <div className={styles.markerBox} ref={markerRef} data-testid="uzbekistan-marker">
              <AnimatedChars text="Uzbekistan" />
            </div>
          </div>
        </h1>
        <p className={styles.description}>{DESCRIPTION}</p>
      </div>
    </div>
  )
}
