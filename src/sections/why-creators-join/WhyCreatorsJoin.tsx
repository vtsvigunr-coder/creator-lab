import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import { JOIN_SLIDES } from './slides'
import styles from './WhyCreatorsJoin.module.css'

const HEADING_LINE_1 = 'Not for everyone.'
const HEADING_LINE_2 = 'For serious players.'
const DESCRIPTION =
  "Creator Lab is built for brands that want real sales, and creators who want long-term value. We are building a curated ecosystem for:"

export default function WhyCreatorsJoin() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const ctx = gsap.context(() => {
      const layers = Array.from(canvas.querySelectorAll<HTMLElement>('[data-join-layer]'))

      // Only the first slide starts visible; the same soft-blur-in state used by every other
      // reveal in this codebase, applied here to the whole layer instead of individual words.
      gsap.set(layers[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
      layers.slice(1).forEach((layer) => {
        gsap.set(layer, { opacity: 0, y: 10, filter: 'blur(8px)' })
      })

      // 1. Entrance — tag wipe, heading soft-blur, description word-reveal. Fires once; the
      //    pinned stage below is untouched by this timeline.
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } })
        .from(canvas.querySelectorAll('[data-wipe-tag]'), {
          width: 0,
          paddingLeft: 0,
          paddingRight: 0,
          duration: 0.55,
          ease: 'sine.inOut',
        })
        .from(
          canvas.querySelectorAll('[data-soft-blur-char]'),
          {
            opacity: 0,
            y: 16,
            filter: 'blur(12px)',
            duration: 0.9,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.025,
          },
          0.25,
        )
        .from(
          canvas.querySelectorAll('[data-desc-word]'),
          {
            opacity: 0,
            y: 10,
            filter: 'blur(8px)',
            duration: 0.6,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.03,
          },
          0.25,
        )

      // 2. Slide switching — scrubbed against the pinned stage. Unlike OurPlatform's
      //    simultaneous crossfade, each transition is two back-to-back halves: the current
      //    layer fades fully out, then the next layer fades in — no overlap.
      const switchTl = gsap.timeline({ paused: true })
      for (let i = 0; i < layers.length - 1; i++) {
        switchTl.to(
          layers[i],
          { opacity: 0, y: -10, filter: 'blur(8px)', duration: 0.5, ease: 'power1.in' },
          i,
        )
        switchTl.fromTo(
          layers[i + 1],
          { opacity: 0, y: 10, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
          i + 0.5,
        )
      }

      ScrollTrigger.create({
        animation: switchTl,
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        snap: {
          snapTo: 1 / (layers.length - 1),
          duration: 0.4,
          ease: 'power1.inOut',
        },
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.whyCreatorsJoin} data-testid="why-creators-join" ref={rootRef}>
      <div className={styles.stage}>
        <div className={styles.canvas} ref={canvasRef}>
          <div className={styles.head}>
            <div className={styles.headGroup}>
              <WipeRevealTag label="Why creators join" />
              <h2 className={styles.heading}>
                <div>
                  <AnimatedChars text={HEADING_LINE_1} />
                </div>
                <div>
                  <AnimatedChars text={HEADING_LINE_2} />
                </div>
              </h2>
            </div>
            <p className={styles.description}>
              <AnimatedWords text={DESCRIPTION} />
            </p>
          </div>

          <div className={styles.slides}>
            {JOIN_SLIDES.map((slide) => (
              <div key={slide.id} className={styles.layer} data-join-layer data-join-id={slide.id}>
                <img className={styles.image} src={slide.image} alt="" data-join-image />
                <p
                  className={`${styles.caption} ${
                    slide.captionSide === 'left' ? styles.captionLeft : styles.captionRight
                  }`}
                  style={{ top: slide.captionTop }}
                  data-join-caption
                >
                  {slide.caption}
                </p>
                {slide.icons.map((icon, i) => (
                  <img
                    key={i}
                    className={styles.icon}
                    src={icon.src}
                    alt=""
                    style={{ top: icon.top, left: icon.left }}
                    data-join-icon
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
