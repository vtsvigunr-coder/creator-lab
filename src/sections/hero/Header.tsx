import { useLayoutEffect, useRef, useState } from 'react'
import AnimatedLogo from './AnimatedLogo'
import NavMenu from './NavMenu'
import CircleRevealButton from './CircleRevealButton'
import { gsap } from '../../lib/gsap'
import { useTranslation } from '../../i18n/LanguageContext'
import userIcon from '../../assets/icons/user.svg'
import styles from './Header.module.css'

type HeaderProps = {
  /** 'light' inverts the logo, user icon, and Get Started button for use over a photo — see
      the 404 page. */
  variant?: 'dark' | 'light'
}

export default function Header({ variant = 'dark' }: HeaderProps) {
  const { t } = useTranslation()
  const userBtnRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const light = variant === 'light'
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [spacerHeight, setSpacerHeight] = useState(0)

  // The header is fixed (see Header.module.css for why), so it no longer reserves its own
  // space in the flow. This spacer stands in for it, keeping every page that mounts Header
  // laid out exactly as if it were still static.
  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return
    const measure = () => setSpacerHeight(header.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const btn = userBtnRef.current
    if (!btn) return
    const tl = gsap.from(btn, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    return () => {
      tl.kill()
    }
  }, [])

  // Hide the header on the way down, bring it back on the way up — but never while sitting
  // near the very top, so it doesn't flicker away on the first small scroll. Polled off gsap's
  // ticker (the same rAF loop Lenis already drives) rather than a native 'scroll' listener,
  // since Lenis's smoothed scroll doesn't reliably dispatch native scroll events.
  useLayoutEffect(() => {
    let lastY = window.scrollY
    const tick = () => {
      const y = window.scrollY
      setScrolled(y >= 80)
      if (y < 80) {
        setHidden(false)
      } else if (y !== lastY) {
        setHidden(y > lastY)
      }
      lastY = y
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <>
      <div style={{ height: spacerHeight }} aria-hidden="true" />
      <header
        ref={headerRef}
        className={`${styles.header} ${light ? styles.light : ''} ${scrolled ? styles.scrolled : ''} ${
          hidden ? styles.hidden : ''
        }`}
      >
        <div className={styles.row}>
          <AnimatedLogo variant={variant} />
          <NavMenu variant={variant} />
          <div className={styles.right}>
            <button ref={userBtnRef} className={styles.userBtn} type="button">
              <img
                className={light ? styles.userIconLight : undefined}
                src={userIcon}
                alt={t.header.accountAlt}
                width={20}
                height={20}
              />
            </button>
            {/* Hidden at mobile widths — it moves inside the burger menu instead (see
                NavMenu's Get Started row). `display: contents` on the wrapper keeps it out of
                the flex layout on desktop, so .right's own gap isn't affected by it existing. */}
            <div className={styles.desktopOnly}>
              <CircleRevealButton label={t.header.getStarted} variant={light ? 'light' : 'dark'} />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
