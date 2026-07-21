import { useLayoutEffect, useRef } from 'react'
import AnimatedLogo from './AnimatedLogo'
import NavMenu from './NavMenu'
import CircleRevealButton from './CircleRevealButton'
import { gsap } from '../../lib/gsap'
import userIcon from '../../assets/icons/user.svg'
import styles from './Header.module.css'

export default function Header() {
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
            <img src={userIcon} alt="Account" width={20} height={20} />
          </button>
          <CircleRevealButton label="Get Started" variant="dark" />
        </div>
      </div>
    </header>
  )
}
