import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedWords } from '../../components/AnimatedText'
import CurvedLabel from './CurvedLabel'
import { SLIDES } from './slides'
import { useTranslation } from '../../i18n/LanguageContext'
import arrowLeft from '../../assets/icons/arrow-left-01-sharp.svg'
import arrowRight from '../../assets/icons/arrow-right-01-sharp.svg'
import styles from './SolutionSlider.module.css'

const STAGE = 560
const RING_RADIUS = STAGE / 2 - 1
const RING_LENGTH = 2 * Math.PI * RING_RADIUS
// Radius the curved label rides on, inside the photo's top edge.
const LABEL_RADIUS = 218
// How long each slide holds before advancing. The ring is the visible countdown, so this is
// also the ring's fill duration.
const AUTOPLAY = 5
const SWITCH = 0.7
// How far around the circle the labels travel on a switch, and how long that takes. Half a
// turn puts the outgoing text at the bottom (out of sight behind the photo) as it leaves.
const LABEL_TURN = 180
const LABEL_SPIN = 0.9

export default function SolutionSlider() {
  const { t } = useTranslation()
  // One piece of state, because the two halves must move together: the outgoing slide stays
  // mounted underneath while the new one opens over it. (Setting them separately meant
  // updating one from inside the other's updater, which React does not run reliably.)
  const [{ index, previous, dir }, setState] = useState<{
    index: number
    previous: number | null
    dir: number
  }>({ index: 0, previous: null, dir: 1 })

  const rootRef = useRef<HTMLDivElement>(null)
  const incomingRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const outgoingLabelRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  // The incoming image of each side circle — clipped open, while the outgoing one sits under it.
  const sideRefs = useRef<(HTMLImageElement | null)[]>([])
  // Autoplay only runs while the section is actually on screen.
  const inView = useRef(false)

  const go = useCallback((step: number) => {
    setState((s) => ({
      index: (s.index + step + SLIDES.length) % SLIDES.length,
      previous: s.index,
      dir: step,
    }))
  }, [])

  const leftIndex = (index + SLIDES.length - 1) % SLIDES.length
  const rightIndex = (index + 1) % SLIDES.length
  const slide = SLIDES[index]
  const left = SLIDES[leftIndex]
  const right = SLIDES[rightIndex]

  // The switch itself: the new photo opens from the centre, the curved label rebuilds letter
  // by letter, and the caption and side circles cross over with it.
  useLayoutEffect(() => {
    const incoming = incomingRef.current
    const label = labelRef.current
    const caption = captionRef.current
    if (!incoming || !label || !caption) return

    const outgoingLabel = outgoingLabelRef.current

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setState((s) => (s.previous === null ? s : { ...s, previous: null })),
      })

      tl.fromTo(
        incoming,
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(50% at 50% 50%)', duration: SWITCH, ease: 'power2.inOut' },
        0,
      )
        // The curved label doesn't fade — it rides the circle. The outgoing text travels half
        // a turn out of view while the incoming one follows it up into place from behind.
        .fromTo(
          label,
          { rotation: -dir * LABEL_TURN },
          { rotation: 0, duration: LABEL_SPIN, ease: 'power2.inOut' },
          0,
        )

      // The outgoing label only exists once a previous slide is mounted — on first render
      // there's nothing to spin or fade out.
      if (outgoingLabel) {
        tl.to(
          outgoingLabel,
          { rotation: dir * LABEL_TURN, duration: LABEL_SPIN, ease: 'power2.inOut' },
          0,
        )
          // It fades over the back half of its trip, so it is gone by the time it would come
          // back into view along the bottom of the circle.
          .to(
            outgoingLabel,
            { opacity: 0, duration: LABEL_SPIN * 0.45, ease: 'power1.in' },
            LABEL_SPIN * 0.4,
          )
      }

      tl
        // The incoming one is the exact mirror of that: it fades up over the first half of
        // its climb instead of snapping into existence at the bottom of the circle.
        .fromTo(
          label,
          { opacity: 0 },
          { opacity: 1, duration: LABEL_SPIN * 0.45, ease: 'power1.out' },
          LABEL_SPIN * 0.15,
        )
        .from(
          caption.querySelectorAll('[data-desc-word]'),
          {
            opacity: 0,
            y: 10,
            filter: 'blur(8px)',
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.03,
          },
          SWITCH * 0.45,
        )
        .fromTo(
          sideRefs.current.filter(Boolean),
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(50% at 50% 50%)', duration: SWITCH, ease: 'power2.inOut' },
          0,
        )
    }, rootRef)

    return () => {
      ctx.revert()
    }
  }, [index, dir])

  // The ring is the autoplay countdown: it fills once per slide and hands over at the end.
  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    const tween = gsap.fromTo(
      ring,
      { strokeDashoffset: RING_LENGTH },
      {
        strokeDashoffset: 0,
        duration: AUTOPLAY,
        ease: 'none',
        paused: !inView.current,
        onComplete: () => go(1),
      },
    )

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onToggle: (self) => {
        inView.current = self.isActive
        if (self.isActive) tween.play()
        else tween.pause()
      },
    })

    return () => {
      tween.kill()
      trigger.kill()
    }
  }, [index, go])

  // Arrow keys drive the slider when it has focus, same as the buttons.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [go])

  return (
    <div className={styles.slider} ref={rootRef} tabIndex={-1} data-testid="solution-slider">
      <div className={`${styles.side} ${styles.sideLeft}`}>
        <div className={styles.sideCircle}>
          {previous !== null && (
            <img src={SLIDES[(previous + SLIDES.length - 1) % SLIDES.length].image} alt="" />
          )}
          <img src={left.image} alt="" ref={(el) => void (sideRefs.current[0] = el)} />
        </div>
        <span className={styles.sideLabel}>{t.solution.slides[leftIndex].label}</span>
      </div>

      <div className={styles.centre}>
        <div className={styles.stageWrap}>
        <div className={styles.stage}>
          <svg className={styles.ring} viewBox={`0 0 ${STAGE} ${STAGE}`} width={STAGE} height={STAGE}>
            <circle
              className={styles.ringProgress}
              ref={ringRef}
              cx={STAGE / 2}
              cy={STAGE / 2}
              r={RING_RADIUS}
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH}
            />
          </svg>
          <div className={styles.photo}>
            {previous !== null && (
              <div className={styles.photoLayer}>
                <img src={SLIDES[previous].image} alt="" />
              </div>
            )}
            <div className={`${styles.photoLayer} ${styles.incoming}`} ref={incomingRef}>
              <img src={slide.image} alt={t.solution.slides[index].label} />
            </div>
          </div>
          {previous !== null && (
            <div className={styles.labelRing} ref={outgoingLabelRef}>
              <CurvedLabel text={t.solution.slides[previous].label} radius={LABEL_RADIUS} size={STAGE} />
            </div>
          )}
          <div className={styles.labelRing} ref={labelRef}>
            <CurvedLabel key={slide.id} text={t.solution.slides[index].label} radius={LABEL_RADIUS} size={STAGE} />
          </div>
        </div>
        </div>

        <div className={styles.nav}>
          <button
            className={styles.navBtn}
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
          >
            <img src={arrowLeft} alt="" />
          </button>
          <button className={styles.navBtn} type="button" onClick={() => go(1)} aria-label="Next">
            <img src={arrowRight} alt="" />
          </button>
        </div>
      </div>

      <div className={`${styles.side} ${styles.sideRight}`}>
        <span className={styles.sideLabel}>{t.solution.slides[rightIndex].label}</span>
        <div className={styles.sideCircle}>
          {previous !== null && <img src={SLIDES[(previous + 1) % SLIDES.length].image} alt="" />}
          <img src={right.image} alt="" ref={(el) => void (sideRefs.current[1] = el)} />
        </div>
      </div>

      <p className={styles.caption} ref={captionRef} key={slide.id} data-slide={index}>
        <AnimatedWords text={t.solution.slides[index].caption} />
      </p>
    </div>
  )
}
