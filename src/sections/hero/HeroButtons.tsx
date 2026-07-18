import { useCallback, useRef } from 'react'
import CircleRevealButton from './CircleRevealButton'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'

type HeroButtonsProps = {
  onComplete?: () => void
}

export default function HeroButtons({ onComplete }: HeroButtonsProps) {
  const players = useRef<Array<() => Promise<void>>>([])
  const registered = useRef(0)
  const started = useRef(false)

  // Stable across re-renders: CircleRevealButton re-runs its setup effect whenever this
  // reference changes, which would tear down and recreate its timeline. Since HeroButtons
  // itself re-renders when `phase` moves from 'buttons' to 'cards', a fresh function here
  // on every render would silently orphan the just-started button timelines.
  const registerPlayer = useCallback((play: () => Promise<void>) => {
    players.current.push(play)
    registered.current += 1
    if (registered.current === 2 && !started.current) {
      started.current = true
      Promise.all(
        players.current.map((p, i) => new Promise((resolve) => setTimeout(() => resolve(p()), i * 120))),
      ).then(() => onComplete?.())
    }
  }, [onComplete])

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <CircleRevealButton label="Apply as a Brand" icon={basketIcon} variant="solid" onReady={registerPlayer} />
      <CircleRevealButton label="Apply as a Creator" icon={videoIcon} variant="outline" onReady={registerPlayer} />
    </div>
  )
}
