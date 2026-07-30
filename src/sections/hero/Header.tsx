import { useLayoutEffect, useRef } from 'react'
import AnimatedLogo from './AnimatedLogo'
import NavMenu from './NavMenu'
import CircleRevealButton from './CircleRevealButton'
import { gsap } from '../../lib/gsap'
import { useTranslation } from '../../i18n/LanguageContext'
import userIcon from '../../assets/icons/user.svg'
import styles from './Header.module.css'

export default function Header() {
  const { t } = useTranslation()
  const userBtnRef = useRef<HTMLButtonElement>(null)

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
        <AnimatedLogo />
        <NavMenu />
        <div className={styles.right}>
          <button ref={userBtnRef} className={styles.userBtn} type="button">
            <img src={userIcon} alt={t.header.accountAlt} width={20} height={20} />
          </button>
          {/* Hidden at mobile widths — it moves inside the burger menu instead (see
              NavMenu's Get Started row). `display: contents` on the wrapper keeps it out of
              the flex layout on desktop, so .right's own gap isn't affected by it existing. */}
          <div className={styles.desktopOnly}>
            <CircleRevealButton label={t.header.getStarted} variant="dark" />
          </div>
        </div>
      </div>
    </header>
  )
}
