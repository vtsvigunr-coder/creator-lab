import gsapCore from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsapCore.registerPlugin(ScrollTrigger)

// ScrollTrigger's default mobile behavior ignores resize events where only the height changes,
// on the assumption it's just the browser chrome (address bar) showing/hiding and not worth a
// re-measure. But CtaFooter's rise trigger computes its `end` from `window.innerHeight` directly
// (see the comment there), so when that address-bar resize happens mid-scroll and this stays
// suppressed, the trigger's `end` never gets recalculated against the new (larger) innerHeight —
// the footer's rise stalls short of the top no matter how far the user scrolls. Forcing a refresh
// on every mobile resize is what keeps that `end` honest.
ScrollTrigger.config({ ignoreMobileResize: false })

export const gsap = gsapCore
export { ScrollTrigger }
