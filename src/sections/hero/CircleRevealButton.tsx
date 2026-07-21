import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import styles from './CircleRevealButton.module.css'

type CircleRevealButtonProps = {
  label: string
  icon?: string
  /** Where the icon sits relative to the label. It is centred in the circle either way. */
  iconPosition?: 'start' | 'end'
  variant: 'solid' | 'outline' | 'dark' | 'light' | 'outlineLight'
  delay?: number
  /** Hold the entrance until the button scrolls into view, instead of playing on mount. */
  startOnScroll?: boolean
}

// Timings traced frame-by-frame off the reference recording (the outline button's measured
// bounding box): the circle scales up over ~0.30s, and only once it has reached full height
// does the width expand — 56px -> 311px over ~0.70s, with the centre staying put the whole
// time. Fitting candidate eases against the traced curve, `sine.inOut` matched closest
// (RMSE 0.050, vs 0.065 for power1.inOut and >0.17 for the sharper cubic-beziers): the
// reference accelerates gently and lands softly rather than snapping through the middle,
// which is what the old back.out overshoot got wrong.
const CIRCLE_DURATION = 0.3
const EXPAND_DURATION = 0.7
const EXPAND_EASE = 'sine.inOut'

export default function CircleRevealButton({
  label,
  icon,
  iconPosition = 'start',
  variant,
  delay = 0,
  startOnScroll = false,
}: CircleRevealButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLImageElement>(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const btn = btnRef.current
    const content = contentRef.current
    const labelEl = labelRef.current
    if (!wrap || !btn || !content || !labelEl) return

    // Measure the natural, fully-laid-out size BEFORE pinning anything down. CSS leaves the
    // button and its content in normal flow precisely so this measurement is the real one.
    const width = btn.offsetWidth
    const height = btn.offsetHeight

    // Where the content sits while the shape is still a circle. Read while still in flow.
    //   - With an icon: the icon's centre goes dead-centre in the circle, so it rides inside
    //     the circle from the first frame and then drifts left as the pill widens.
    //   - Without one (Get Started): park the label's left edge exactly on the circle's right
    //     edge instead, so the circle reads as empty and the text is only ever uncovered by
    //     the growing right edge — anchoring its left edge to the circle's *left* edge would
    //     park the first few letters inside the circle.
    const iconEl = iconRef.current
    const contentStartX = iconEl
      ? height / 2 - (iconEl.offsetLeft + iconEl.offsetWidth / 2)
      : height - labelEl.offsetLeft

    // Freeze the final footprint on the wrapper, then lift the button out of flow so that
    // animating its width can never reflow the row — in the recording the outline button
    // stays rooted at x=655 while its neighbour expands. Pinning the content's width too
    // stops the label re-wrapping as the button narrows to a circle. All of this happens
    // inside useLayoutEffect, i.e. synchronously before paint, so nothing flashes.
    wrap.style.width = `${width}px`
    wrap.style.height = `${height}px`
    btn.style.position = 'absolute'
    btn.style.left = '50%'
    btn.style.top = '0'
    btn.style.height = `${height}px`
    content.style.position = 'absolute'
    content.style.left = '0'
    content.style.top = '0'
    content.style.height = '100%'
    content.style.width = `${width}px`

    // `left: 50%` + xPercent keeps GSAP the sole owner of the transform, so the -50%
    // centring composes with `scale` instead of being clobbered by it.
    gsap.set(btn, { xPercent: -50, width: height, scale: 0, transformOrigin: '50% 50%' })
    gsap.set(content, { x: contentStartX })
    // The icon rides inside the circle from the first frame (it scales up with it), but the
    // label must not flash inside the circle — it only starts wiping in once the width does.
    gsap.set(labelEl, { opacity: 0 })

    // No `paused` alongside scrollTrigger: the trigger owns playback, and pausing as well
    // leaves the button stuck as a zero-scale dot forever.
    const tl = gsap.timeline({
      delay,
      scrollTrigger: startOnScroll ? { trigger: wrap, start: 'top 85%', once: true } : undefined,
    })

    tl.to(btn, { scale: 1, duration: CIRCLE_DURATION, ease: 'power2.out' })
    tl.to(btn, { width, duration: EXPAND_DURATION, ease: EXPAND_EASE })
    // Synced to the width tween: as the pill widens, the content slides left into its final
    // padded position, which is what makes the icon drift out of the centre in the reference.
    tl.to(content, { x: 0, duration: EXPAND_DURATION, ease: EXPAND_EASE }, '<')
    // The left-to-right reveal is the button's own growing right edge clipping the label —
    // this only fades it up so nothing is visible while the shape is still a circle.
    tl.to(labelEl, { opacity: 1, duration: 0.18, ease: 'power1.out' }, '<+=0.05')

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [delay, startOnScroll])

  return (
    <span ref={wrapRef} className={styles.wrap}>
      <button ref={btnRef} className={`${styles.btn} ${styles[variant]}`} type="button">
        <span ref={contentRef} className={styles.content}>
          {icon && iconPosition === 'start' && (
            <img ref={iconRef} src={icon} alt="" className={styles.icon} />
          )}
          <span ref={labelRef} className={styles.label}>
            {label}
          </span>
          {icon && iconPosition === 'end' && (
            <img ref={iconRef} src={icon} alt="" className={styles.icon} />
          )}
        </span>
      </button>
    </span>
  )
}
