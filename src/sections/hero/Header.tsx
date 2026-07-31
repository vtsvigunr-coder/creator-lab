import { useLayoutEffect, useRef } from 'react'
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
  const light = variant === 'light'

  useLayoutEffect(() => {
    const btn = userBtnRef.current
    if (!btn) return
    const tl = gsap.from(btn, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    return () => {
      tl.kill()
    }
  }, [])

  return (
    <header className={styles.header}>
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
  )
}
