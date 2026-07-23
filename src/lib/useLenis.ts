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

    // This first refresh runs against whatever has painted so far — on a cold cache, that's
    // still the fallback font and any images that haven't finished downloading. The variable
    // font swapping in (or an image without reserved aspect ratio loading in) reflows the
    // page afterwards, but every trigger's start/end stays pinned to the stale pixel offsets
    // from that first measurement. The footer's scrub is the most visible casualty — its
    // "rise fully" endpoint silently drifts below the page's real bottom, so it stalls
    // part-way no matter how far the user scrolls. Refreshing again once fonts and images
    // have actually settled is what keeps every scroll-driven section honest.
    let live = true
    // jsdom (the test environment) doesn't implement the Font Loading API.
    document.fonts?.ready.then(() => {
      if (live) ScrollTrigger.refresh()
    })
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      live = false
      window.removeEventListener('load', onLoad)
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
