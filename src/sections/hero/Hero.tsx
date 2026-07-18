import Header from './Header'
import HeroTitle from './HeroTitle'
import HeroButtons from './HeroButtons'
import CardMarquee from './CardMarquee'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <div className={styles.hero} data-testid="hero">
      <Header />
      <div className={styles.centerBlock}>
        <HeroTitle />
        <HeroButtons />
      </div>
      <CardMarquee />
    </div>
  )
}
