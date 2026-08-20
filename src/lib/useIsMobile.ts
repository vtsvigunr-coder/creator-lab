import { useEffect, useState } from 'react'

/** The one breakpoint the section stylesheets switch layouts at. */
export const MOBILE_MEDIA_QUERY = '(max-width: 640px)'

/**
 * True while the viewport is at the mobile breakpoint.
 *
 * Used to pick between the desktop and mobile line splits a translation carries: the Russian
 * frames break several headings differently at the two sizes, and rendering both copies and
 * hiding one with CSS would leave the hidden text in the DOM for the character-splitting
 * entrance animations to find and measure.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
