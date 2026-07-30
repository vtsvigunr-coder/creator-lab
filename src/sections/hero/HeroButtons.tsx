import CircleRevealButton from './CircleRevealButton'
import { useTranslation } from '../../i18n/LanguageContext'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'
import styles from './HeroButtons.module.css'

export default function HeroButtons() {
  const { t } = useTranslation()
  return (
    <div className={styles.row}>
      <CircleRevealButton label={t.hero.applyAsBrand} icon={basketIcon} variant="solid" delay={0.08} fluid />
      <CircleRevealButton label={t.hero.applyAsCreator} icon={videoIcon} variant="outline" delay={0.16} fluid />
    </div>
  )
}
