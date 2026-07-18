import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import styles from './CircleRevealButton.module.css'

type CircleRevealButtonProps = {
  label: string
  icon?: string
  variant: 'solid' | 'outline' | 'dark'
  delay?: number
}

export default function CircleRevealButton({ label, icon, variant, delay = 0 }: CircleRevealButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLImageElement>(null)

  useLayoutEffect(() => {
    const btn = btnRef.current
    const labelEl = labelRef.current
    const iconEl = iconRef.current
    if (!btn || !labelEl) return

    // The button stays at its final (padded) layout size the whole time — only a
    // clip-path circle grows to reveal it. Animating layout `width` instead would shift
    // any sibling relying on this button's box (e.g. the header's user avatar).
    // clip-path also guarantees a true circle regardless of the button's own aspect ratio,
    // unlike a CSS transform: scale(0) starting point.
    gsap.set(btn, { clipPath: 'circle(18px at 50% 50%)' })
    gsap.set(labelEl, { opacity: 0 })
    if (iconEl) gsap.set(iconEl, { opacity: 0 })

    const tl = gsap.timeline({ delay })

    // Sequential, not overlapping: the circle must finish expanding to the button's full
    // size first, and only then does the icon/label content fade in.
    tl.to(btn, { clipPath: 'circle(150% at 50% 50%)', duration: 0.5, ease: 'back.out(1.4)' })
    if (iconEl) {
      tl.to(iconEl, { opacity: 1, duration: 0.25, ease: 'power1.out' })
    }
    tl.to(labelEl, { opacity: 1, duration: 0.25, ease: 'power1.out' }, iconEl ? '-=0.1' : '+=0')

    return () => {
      tl.kill()
    }
  }, [delay])

  return (
    <button ref={btnRef} className={`${styles.btn} ${styles[variant]}`} type="button">
      {icon && <img ref={iconRef} src={icon} alt="" className={styles.icon} />}
      <span ref={labelRef} className={styles.label}>
        {label}
      </span>
    </button>
  )
}
