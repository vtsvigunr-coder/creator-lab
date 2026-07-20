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
  const headRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const head = headRef.current
    const canvas = canvasRef.current
    if (!root || !head || !canvas) return

    const ctx = gsap.context(() => {
      const mediaLayers = Array.from(canvas.querySelectorAll<HTMLElement>('[data-join-layer]'))
      const captions = Array.from(canvas.querySelectorAll<HTMLElement>('[data-join-caption]'))
      const captionChars = captions.map((c) =>
        Array.from(c.querySelectorAll<HTMLElement>('[data-soft-blur-char]')),
      )

      // Only the first slide starts visible; the same soft-blur-in state used by every other
      // reveal in this codebase. The image/icons fade as one block; the caption's characters
      // are tracked separately so they can play the same per-character reveal as the heading.
      gsap.set(mediaLayers[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
      mediaLayers.slice(1).forEach((layer) => {
        gsap.set(layer, { opacity: 0, y: 10, filter: 'blur(8px)' })
      })
      gsap.set(captionChars[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
      captionChars.slice(1).forEach((chars) => {
        gsap.set(chars, { opacity: 0, y: 10, filter: 'blur(8px)' })
      })

      // 1. Entrance — tag wipe, heading soft-blur, description word-reveal. Scoped to the head
      //    block only, so it never touches the slide captions' own soft-blur-char units below.
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } })
        .from(head.querySelectorAll('[data-wipe-tag]'), {
          width: 0,
          paddingLeft: 0,
          paddingRight: 0,
          duration: 0.55,
          ease: 'sine.inOut',
        })
        .from(
          head.querySelectorAll('[data-soft-blur-char]'),
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
          head.querySelectorAll('[data-desc-word]'),
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

      // 2. Slide switching — scrubbed against the pinned stage, spread over enough extra scroll
      //    height that it takes roughly three scroll steps to land on the next slide instead of
      //    one. Each transition is two back-to-back halves, no crossfade overlap: the current
      //    slide fades fully out, then the next fades in. The image/icons fade as a block; the
      //    caption instead plays the same per-character soft-blur stagger as the heading.
      const switchTl = gsap.timeline({ paused: true })
      for (let i = 0; i < mediaLayers.length - 1; i++) {
        switchTl.to(
          mediaLayers[i],
          { opacity: 0, y: -10, filter: 'blur(8px)', duration: 0.5, ease: 'power1.in' },
          i,
        )
        switchTl.fromTo(
          mediaLayers[i + 1],
          { opacity: 0, y: 10, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
          i + 0.5,
        )

        switchTl.to(
          captionChars[i],
          {
            opacity: 0,
            y: -16,
            filter: 'blur(12px)',
            duration: 0.4,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.015,
          },
          i,
        )
        switchTl.fromTo(
          captionChars[i + 1],
          { opacity: 0, y: 16, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.015,
          },
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
          snapTo: 1 / (mediaLayers.length - 1),
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
          <div className={styles.head} ref={headRef}>
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
            {JOIN_SLIDES.map((slide) => (
              <p
                key={slide.id}
                className={`${styles.caption} ${
                  slide.captionSide === 'left' ? styles.captionLeft : styles.captionRight
                }`}
                style={{ top: slide.captionTop }}
                data-join-caption
                data-join-id={slide.id}
              >
                <AnimatedChars text={slide.caption} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
