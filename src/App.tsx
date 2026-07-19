import { useLenis } from './lib/useLenis'
import Hero from './sections/hero/Hero'
import Problem from './sections/problem/Problem'
import Solution from './sections/solution/Solution'
import HowItWorks from './sections/how-it-works/HowItWorks'
import ForBrands from './sections/for-brands/ForBrands'
import ForCreators from './sections/for-creators/ForCreators'
import OurPlatform from './sections/our-platform/OurPlatform'
import styles from './App.module.css'

export default function App() {
  useLenis()

  return (
    <div className={styles.root} data-testid="app-root">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <ForBrands />
      <ForCreators />
      <OurPlatform />
    </div>
  )
}
