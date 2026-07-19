import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // ScrollTrigger keeps its own scroll memory and restores the previous offset on refresh,
    // which would undo the reset in main.tsx and drop a reload back mid-page. Clearing it
    // (and re-asserting manual restoration) is what actually makes a reload start on the hero.
    ScrollTrigger.clearScrollMemory('manual')
    ScrollTrigger.refresh()
    lenis.scrollTo(0, { immediate: true })

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
