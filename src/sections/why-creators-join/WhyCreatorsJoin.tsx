import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import { JOIN_SLIDES } from './slides'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './WhyCreatorsJoin.module.css'

// How much extra scroll each slide holds before the cut to the next — ~3 mouse-wheel notches
// (each notch is ~110-120px), sized up from that baseline so a single trackpad swipe (which
// covers far more distance per gesture than one wheel notch) doesn't blow through the hold zone
// and cut early. The section's CSS height adds a further HOLD_PX tail after the last boundary,
// so the last slide holds for the same dead zone before releasing into the FAQ section instead
// of cutting straight to it. Keep HOLD_PX changes in sync with WhyCreatorsJoin.module.css.
const HOLD_PX = 600

const DESKTOP_MEDIA_QUERY = '(min-width: 641px)'
const MOBILE_MEDIA_QUERY = '(max-width: 640px)'

// Builds the same "hold, then cut" slide-switch timeline/ScrollTrigger pair used on both
// breakpoints — only the DOM (and therefore the fade distances) differ between them.
function buildSlideSwitch(
  root: HTMLElement,
  mediaLayers: HTMLElement[],
  captionChars: HTMLElement[][],
) {
  const triggers: ScrollTrigger[] = []
  for (let i = 0; i < mediaLayers.length - 1; i++) {
    const tl = gsap.timeline({ paused: true })
    tl.to(mediaLayers[i], { opacity: 0, y: -10, filter: 'blur(8px)', duration: 0.18, ease: 'power1.in' }, 0)
    tl.fromTo(
      mediaLayers[i + 1],
      { opacity: 0, y: 10, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.22, ease: 'power2.out' },
      0.18,
    )
    tl.to(
      captionChars[i],
      {
        opacity: 0,
        y: -16,
        filter: 'blur(12px)',
        duration: 0.15,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        // Bounded rather than per-character: the Russian captions are long enough that a flat
        // 0.008s/char runs past the end of the switch, leaving the tail of the sentence still
        // blurred once the transition has visibly finished.
        stagger: { each: 0.008, amount: 0.24 },
      },
      0,
    )
    tl.fromTo(
      captionChars[i + 1],
      { opacity: 0, y: 16, filter: 'blur(12px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.2,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        stagger: { each: 0.01, amount: 0.3 },
      },
      0.18,
    )

    const offset = HOLD_PX * (i + 1)
    triggers.push(
      ScrollTrigger.create({
        trigger: root,
        start: `top+=${offset} top`,
        end: `top+=${offset + 1} top`,
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      }),
    )
  }
  return triggers
}

export default function WhyCreatorsJoin() {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const mobileHeadRef = useRef<HTMLDivElement>(null)
  const mobileCanvasRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const head = headRef.current
    const canvas = canvasRef.current
    const mobileHead = mobileHeadRef.current
    const mobileCanvas = mobileCanvasRef.current
    if (!root || !head || !canvas || !mobileHead || !mobileCanvas) return

    const ctx = gsap.context(() => {
      // Entrance — tag wipe, heading soft-blur, description word-reveal. Identical on both
      // breakpoints; only the DOM it's scoped to differs, since the mobile head is a separate
      // (CSS-toggled) copy rather than a scaled clone of the desktop one.
      const playEntrance = (headEl: HTMLElement) => {
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } })
          .from(headEl.querySelectorAll('[data-wipe-tag]'), {
            width: 0,
            paddingLeft: 0,
            paddingRight: 0,
            duration: 0.55,
            ease: 'sine.inOut',
          })
          .from(
            headEl.querySelectorAll('[data-soft-blur-char]'),
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
            headEl.querySelectorAll('[data-desc-word]'),
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
      }

      // Slide switching — NOT scrubbed. Each slide holds for a dead zone of extra scroll (~3
      // wheel notches, HOLD_PX), then the scroll that crosses the boundary triggers one quick,
      // self-contained cut — image/icons fade out then the next fades in, caption plays the same
      // per-character soft-blur stagger as the heading — that plays to completion on its own
      // regardless of further scroll input. Scrolling back up past the boundary reverses the cut.
      const setupSlides = (mediaLayers: HTMLElement[], captions: HTMLElement[]) => {
        const captionChars = captions.map((c) =>
          Array.from(c.querySelectorAll<HTMLElement>('[data-soft-blur-char]')),
        )
        gsap.set(mediaLayers[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
        mediaLayers.slice(1).forEach((layer) => {
          gsap.set(layer, { opacity: 0, y: 10, filter: 'blur(8px)' })
        })
        gsap.set(captionChars[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
        captionChars.slice(1).forEach((chars) => {
          gsap.set(chars, { opacity: 0, y: 10, filter: 'blur(8px)' })
        })
        return buildSlideSwitch(root, mediaLayers, captionChars)
      }

      ScrollTrigger.matchMedia({
        [DESKTOP_MEDIA_QUERY]: () => {
          playEntrance(head)
          const mediaLayers = Array.from(canvas.querySelectorAll<HTMLElement>('[data-join-layer]'))
          const captions = Array.from(canvas.querySelectorAll<HTMLElement>('[data-join-caption]'))
          const triggers = setupSlides(mediaLayers, captions)
          return () => triggers.forEach((t) => t.kill())
        },
        [MOBILE_MEDIA_QUERY]: () => {
          playEntrance(mobileHead)
          const mediaLayers = Array.from(
            mobileCanvas.querySelectorAll<HTMLElement>('[data-mobile-join-media]'),
          )
          const captions = Array.from(
            mobileCanvas.querySelectorAll<HTMLElement>('[data-mobile-join-caption]'),
          )
          const triggers = setupSlides(mediaLayers, captions)
          return () => triggers.forEach((t) => t.kill())
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
              <WipeRevealTag label={t.whyCreatorsJoin.tag} />
              <h2 className={styles.heading}>
                <div>
                  <AnimatedChars text={t.whyCreatorsJoin.headingLine1} />
                </div>
                <div>
                  <AnimatedChars text={t.whyCreatorsJoin.headingLine2} />
                </div>
              </h2>
            </div>
            <p className={styles.description}>
              <AnimatedWords text={t.whyCreatorsJoin.description} />
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
            {JOIN_SLIDES.map((slide, i) => (
              <p
                key={slide.id}
                className={`${styles.caption} ${
                  slide.captionSide === 'left' ? styles.captionLeft : styles.captionRight
                }`}
                style={{ top: slide.captionTop }}
                data-join-caption
                data-join-id={slide.id}
                data-slide={i}
              >
                <AnimatedChars text={t.whyCreatorsJoin.slides[i].caption} />
              </p>
            ))}
          </div>
        </div>

        <div className={styles.mobileCanvas} ref={mobileCanvasRef}>
          <div className={styles.mobileHead} ref={mobileHeadRef}>
            <div className={styles.mobileHeadGroup}>
              <WipeRevealTag label={t.whyCreatorsJoin.tag} />
              <h2 className={styles.mobileHeading}>
                {/* The mobile frame breaks this mid-sentence rather than between the two
                    desktop lines. */}
                {(t.whyCreatorsJoin.headingLinesMobile ?? [
                  t.whyCreatorsJoin.headingLine1,
                  t.whyCreatorsJoin.headingLine2,
                ]).map((line) => (
                  <div key={line}>
                    <AnimatedChars text={line} />
                  </div>
                ))}
              </h2>
            </div>
            <p className={styles.mobileDescription}>
              <AnimatedWords text={t.whyCreatorsJoin.description} />
            </p>
          </div>

          <div className={styles.mobileSlides}>
            {JOIN_SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={styles.mobileLayer}
                data-mobile-join-layer
                data-join-id={slide.id}
              >
                <p className={styles.mobileTitle} data-mobile-join-caption>
                  <AnimatedChars text={t.whyCreatorsJoin.slides[i].caption} />
                </p>
                <div className={styles.mobileImageBox} data-mobile-join-media>
                  <img className={styles.mobileImage} src={slide.image} alt="" />
                  {slide.mobileIcons.map((icon, i) => (
                    <img
                      key={i}
                      className={styles.mobileIcon}
                      src={icon.src}
                      alt=""
                      style={{ top: icon.top, left: icon.left }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
