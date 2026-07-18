import CircleRevealButton from './CircleRevealButton'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'

export default function HeroButtons() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <CircleRevealButton label="Apply as a Brand" icon={basketIcon} variant="solid" delay={0.08} />
      <CircleRevealButton label="Apply as a Creator" icon={videoIcon} variant="outline" delay={0.16} />
    </div>
  )
}
