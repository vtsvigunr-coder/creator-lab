import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import styles from './CircleRevealButton.module.css'

type CircleRevealButtonProps = {
  label: string
  icon?: string
  variant: 'solid' | 'outline' | 'dark'
  onReady?: (play: () => Promise<void>) => void
}

export default function CircleRevealButton({ label, icon, variant, onReady }: CircleRevealButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const btn = btnRef.current
    const labelEl = labelRef.current
    if (!btn || !labelEl) return

    const targetWidth = btn.scrollWidth
    // GSAP animates scale/x via the independent CSS scale/translate properties, so the
    // starting state must be set through GSAP itself (not a CSS transform: scale(0) rule,
    // which would combine with GSAP's own scale property instead of being replaced by it).
    gsap.set(btn, { scale: 0 })
    gsap.set(labelEl, { opacity: 0, x: -8 })

    const tl = gsap.timeline({ paused: true })

    tl.to(btn, { scale: 1, duration: 0.35, ease: 'back.out(1.7)' })
      .to(btn, { width: targetWidth, duration: 0.4, ease: 'power2.inOut' }, '-=0.05')
      .to(labelEl, { opacity: 1, x: 0, duration: 0.3, ease: 'power1.out' }, '-=0.3')

    onReady?.(() => tl.play().then(() => {}))

    return () => {
      tl.kill()
    }
  }, [onReady])

  return (
    <button ref={btnRef} className={`${styles.btn} ${styles[variant]}`} type="button">
      {icon && <img src={icon} alt="" className={styles.icon} />}
      <span ref={labelRef} className={styles.label}>
        {label}
      </span>
    </button>
  )
}
