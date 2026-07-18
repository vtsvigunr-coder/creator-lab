import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import styles from './CircleRevealButton.module.css'

type CircleRevealButtonProps = {
  label: string
  icon?: string
  variant: 'solid' | 'outline' | 'dark'
  delay?: number
  compact?: boolean
}

export default function CircleRevealButton({
  label,
  icon,
  variant,
  delay = 0,
  compact = false,
}: CircleRevealButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const btn = btnRef.current
    const labelEl = labelRef.current
    if (!btn || !labelEl) return

    // The button stays at its final (padded) layout size the whole time — only a
    // clip-path circle grows to reveal it. Animating layout `width` instead would shift
    // any sibling relying on this button's box (e.g. the header's user avatar).
    // clip-path also guarantees a true circle regardless of the button's own aspect ratio,
    // unlike a CSS transform: scale(0) starting point.
    const startRadius = compact ? 18 : 22
    gsap.set(btn, { clipPath: `circle(${startRadius}px at 50% 50%)` })
    gsap.set(labelEl, { opacity: 0, x: -8 })

    const tl = gsap.timeline({ delay })

    tl.to(btn, { clipPath: 'circle(150% at 50% 50%)', duration: 0.5, ease: 'back.out(1.4)' }).to(
      labelEl,
      { opacity: 1, x: 0, duration: 0.3, ease: 'power1.out' },
      '-=0.25',
    )

    return () => {
      tl.kill()
    }
  }, [delay, compact])

  return (
    <button
      ref={btnRef}
      className={`${styles.btn} ${styles[variant]} ${compact ? styles.compact : ''}`}
      type="button"
    >
      {icon && <img src={icon} alt="" className={styles.icon} />}
      <span ref={labelRef} className={styles.label}>
        {label}
      </span>
    </button>
  )
}
