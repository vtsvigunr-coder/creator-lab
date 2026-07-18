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

  // Stable across re-renders (Hero re-renders on every phase change): CircleRevealButton's
  // setup effect depends on this reference, so a fresh function per render would tear down
  // and recreate the Get Started timeline every time, orphaning it before it ever plays.
  const handleGetStartedReady = useCallback((play: () => Promise<void>) => {
    getStartedPlay.current = play
  }, [])

  return (
    <div className={styles.hero} data-testid="hero">
      <Header onLogoComplete={handleLogoComplete} onGetStartedReady={handleGetStartedReady} />
      <div className={styles.centerBlock}>
        {phase !== 'idle' && <HeroTitle onComplete={handleTitleComplete} />}
        {(phase === 'buttons' || phase === 'cards') && <HeroButtons onComplete={handleButtonsComplete} />}
      </div>
      {phase === 'cards' && <CardMarquee />}
    </div>
  )
}
