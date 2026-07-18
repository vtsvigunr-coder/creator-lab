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
    // GSAP takes over the independent `scale`/`translate` CSS properties as soon as it
    // starts ticking, overriding the CSS class's `transform: scale(0)`. Set the starting
    // state through GSAP itself (synchronous, no tick required) so there's no mismatch.
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
