import { useLayoutEffect, useRef } from 'react'
import Logo from '../../assets/images/Logo.svg?react'
import { gsap } from '../../lib/gsap'
import { sortLogoPaths } from '../../lib/sortLogoPaths'
import styles from './AnimatedLogo.module.css'

type AnimatedLogoProps = {
  onComplete?: () => void
}

export default function AnimatedLogo({ onComplete }: AnimatedLogoProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return

    const paths = sortLogoPaths(Array.from(host.querySelectorAll('path')))
    const tl = gsap.timeline({ onComplete })

    tl.from(paths, {
      y: -14,
      opacity: 0,
      duration: 0.4,
      ease: 'cubic-bezier(0.18, 1, 0.32, 1)',
      stagger: 0.088,
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div ref={hostRef} className={styles.host} data-testid="animated-logo">
      <Logo />
    </div>
  )
}
