import { useLayoutEffect, useRef } from 'react'
import Logo from '../../assets/images/Logo.svg?react'
import { gsap } from '../../lib/gsap'
import { sortLogoPaths } from '../../lib/sortLogoPaths'
import { partitionLogoPaths } from '../../lib/partitionLogoPaths'
import styles from './AnimatedLogo.module.css'

type AnimatedLogoProps = {
  /** 'light' turns the mark and wordmark white, for use over photos — see the 404 header. */
  variant?: 'dark' | 'light'
}

export default function AnimatedLogo({ variant = 'dark' }: AnimatedLogoProps) {
  const hostRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return

    const sorted = sortLogoPaths(Array.from(host.querySelectorAll('path')))
    const { markPaths, letterPaths } = partitionLogoPaths(sorted)
    const tl = gsap.timeline()

    tl.from(markPaths, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0).from(
      letterPaths,
      {
        y: -14,
        opacity: 0,
        duration: 0.4,
        ease: 'cubic-bezier(0.18, 1, 0.32, 1)',
        stagger: 0.088,
      },
      0,
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <a
      ref={hostRef}
      href="/"
      className={`${styles.host} ${variant === 'light' ? styles.light : ''}`}
      data-testid="animated-logo"
      aria-label="Creator Lab home"
    >
      <Logo />
    </a>
  )
}
