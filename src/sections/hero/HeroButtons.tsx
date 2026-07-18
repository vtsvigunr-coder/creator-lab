import { useRef } from 'react'
import CircleRevealButton from './CircleRevealButton'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'

type HeroButtonsProps = {
  onComplete?: () => void
}

export default function HeroButtons({ onComplete }: HeroButtonsProps) {
  const players = useRef<Array<() => Promise<void>>>([])
  const registered = useRef(0)

  const registerPlayer = (play: () => Promise<void>) => {
    players.current.push(play)
    registered.current += 1
    if (registered.current === 2) {
      Promise.all(
        players.current.map((p, i) => new Promise((resolve) => setTimeout(() => resolve(p()), i * 120))),
      ).then(() => onComplete?.())
    }
  }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <CircleRevealButton label="Apply as a Brand" icon={basketIcon} variant="solid" onReady={registerPlayer} />
      <CircleRevealButton label="Apply as a Creator" icon={videoIcon} variant="outline" onReady={registerPlayer} />
    </div>
  )
}
