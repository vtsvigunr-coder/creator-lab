import { useLenis } from './lib/useLenis'
import Hero from './sections/hero/Hero'
import styles from './App.module.css'

export default function App() {
  useLenis()

  return (
    <div className={styles.root} data-testid="app-root">
      <Hero />
    </div>
  )
}
