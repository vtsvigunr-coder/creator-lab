import { useState } from 'react'
import AnimatedLogo from './AnimatedLogo'
import MenuOverlay from './MenuOverlay'
import CircleRevealButton from './CircleRevealButton'
import userIcon from '../../assets/icons/user.svg'
import styles from './Header.module.css'

type HeaderProps = {
  onLogoComplete?: () => void
  onGetStartedReady?: (play: () => Promise<void>) => void
}

export default function Header({ onLogoComplete, onGetStartedReady }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <AnimatedLogo onComplete={onLogoComplete} />
      <MenuOverlay open={menuOpen} onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)} />
      <div className={styles.right}>
        <button className={styles.userBtn} type="button">
          <img src={userIcon} alt="Account" width={20} height={20} />
        </button>
        <CircleRevealButton label="Get Started" variant="dark" onReady={onGetStartedReady} />
      </div>
    </header>
  )
}
