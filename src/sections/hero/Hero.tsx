import { useCallback, useRef, useState } from 'react'
import Header from './Header'
import HeroTitle from './HeroTitle'
import HeroButtons from './HeroButtons'
import CardMarquee from './CardMarquee'
import styles from './Hero.module.css'

export default function Hero() {
  const [phase, setPhase] = useState<'idle' | 'title' | 'buttons' | 'cards'>('idle')
  const getStartedPlay = useRef<(() => Promise<void>) | null>(null)

  const handleLogoComplete = useCallback(() => {
    setPhase('title')
  }, [])

  const handleTitleComplete = useCallback(() => {
    setPhase('buttons')
    getStartedPlay.current?.()
  }, [])

  const handleButtonsComplete = useCallback(() => {
    setPhase('cards')
  }, [])

  return (
    <div className={styles.hero} data-testid="hero">
      <Header
        onLogoComplete={handleLogoComplete}
        onGetStartedReady={(play) => {
          getStartedPlay.current = play
        }}
      />
      <div className={styles.centerBlock}>
        {phase !== 'idle' && <HeroTitle onComplete={handleTitleComplete} />}
        {(phase === 'buttons' || phase === 'cards') && <HeroButtons onComplete={handleButtonsComplete} />}
      </div>
      {phase === 'cards' && <CardMarquee />}
    </div>
  )
}
