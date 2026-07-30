import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import CircleRevealButton from '../hero/CircleRevealButton'
import arrowIcon from '../../assets/icons/arrow-right-02-sharp.svg'
import arrowLeft from '../../assets/icons/arrow-left-01-sharp.svg'
import arrowRight from '../../assets/icons/arrow-right-01-sharp.svg'
import { PLATFORM_TABS } from './tabs'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './OurPlatform.module.css'

// How much extra scroll each tab holds before the cut to the next — ~3 mouse-wheel notches
// (each notch is ~110-120px), sized up from that baseline so a single trackpad swipe (which
// covers far more distance per gesture than one wheel notch) doesn't blow through the hold
// zone and cut early.
const HOLD_PX = 600

// The rail's vertical rhythm, traced off the Figma frame: tab labels sit 82px apart starting at
// 414px, the indicator bracket is centred on each row, and the dot sits mid-row.
const FIRST_ROW_TOP = 414
const ROW_PITCH = 82
const indicatorTop = (i: number) => FIRST_ROW_TOP + i * ROW_PITCH - 31
const dotTop = (i: number) => FIRST_ROW_TOP + i * ROW_PITCH + 5

const DESKTOP_MEDIA_QUERY = '(min-width: 641px)'
const MOBILE_MEDIA_QUERY = '(max-width: 640px)'
// Same "instant cut" feel as the desktop tab switch, just triggered by a tap/swipe instead of
// a scroll boundary — see the matching crossfade in the desktop timeline below.
const MOBILE_SWITCH = 0.3
// Minimum horizontal drag (px) before a swipe on the card counts as a step instead of a tap.
const SWIPE_THRESHOLD = 40

export default function OurPlatform() {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // --- mobile: same 3 tabs, switched by tapping the nav arrows or swiping the card instead of
  // scrolling. The desktop canvas above is hidden entirely below 640px (see the stylesheet). ---
  const mobileRootRef = useRef<HTMLDivElement>(null)
  const mobileCardRef = useRef<HTMLDivElement>(null)
  const mobileImageRefs = useRef<(HTMLImageElement | null)[]>([])
  const mobilePaneRefs = useRef<(HTMLDivElement | null)[]>([])
  const [mobileIndex, setMobileIndex] = useState(0)
  const prevMobileIndexRef = useRef(0)

  const goMobile = useCallback((step: number) => {
    setMobileIndex((i) => {
      const next = i + step
      if (next < 0 || next >= PLATFORM_TABS.length) return i
      return next
    })
  }, [])

  // The crossfade itself: fades the outgoing image/caption out while the incoming one fades in,
  // mirroring the desktop tab-switch cut above but driven by React state instead of ScrollTrigger.
  useLayoutEffect(() => {
    const prevIndex = prevMobileIndexRef.current
    prevMobileIndexRef.current = mobileIndex
    if (prevIndex === mobileIndex) return

    const outImage = mobileImageRefs.current[prevIndex]
    const inImage = mobileImageRefs.current[mobileIndex]
    const outPane = mobilePaneRefs.current[prevIndex]
    const inPane = mobilePaneRefs.current[mobileIndex]
    if (!outImage || !inImage || !outPane || !inPane) return

    const tl = gsap.timeline()
    tl.to(outImage, { opacity: 0, duration: MOBILE_SWITCH, ease: 'power1.inOut' }, 0)
      .to(inImage, { opacity: 1, duration: MOBILE_SWITCH, ease: 'power1.inOut' }, 0)
      .to(
        outPane.querySelectorAll('[data-mobile-fade]'),
        { opacity: 0, y: -6, filter: 'blur(6px)', duration: 0.15, ease: 'power1.in', stagger: 0.01 },
        0,
      )
      .fromTo(
        inPane.querySelectorAll('[data-mobile-fade]'),
        { opacity: 0, y: 10, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.2, ease: 'power2.out', stagger: 0.02 },
        0.12,
      )

    return () => {
      tl.kill()
    }
  }, [mobileIndex])

  // Swipe: a horizontal drag on the card past SWIPE_THRESHOLD steps it, same as tapping a nav
  // arrow. Vertical drags (page scroll) are ignored by comparing the two deltas.
  useLayoutEffect(() => {
    const card = mobileCardRef.current
    if (!card) return

    let startX = 0
    let startY = 0
    let dragging = false

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      startX = e.clientX
      startY = e.clientY
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        goMobile(dx < 0 ? 1 : -1)
      }
    }
    const onPointerCancel = () => {
      dragging = false
    }

    card.addEventListener('pointerdown', onPointerDown)
    card.addEventListener('pointerup', onPointerUp)
    card.addEventListener('pointercancel', onPointerCancel)
    return () => {
      card.removeEventListener('pointerdown', onPointerDown)
      card.removeEventListener('pointerup', onPointerUp)
      card.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [goMobile])

  useLayoutEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const content = contentRef.current
    const mobileRoot = mobileRootRef.current
    if (!root || !stage || !content) return

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        [MOBILE_MEDIA_QUERY]: () => {
          if (!mobileRoot) return () => {}

          // All 3 image/caption panes are stacked in the DOM (see JSX below); only the first
          // is visible until a swipe/tap crossfades to another — same trick as the desktop
          // bgLayers, just not driven by scroll.
          gsap.set(mobileImageRefs.current.slice(1), { opacity: 0 })
          mobilePaneRefs.current.slice(1).forEach((pane) => {
            if (pane) gsap.set(pane.querySelectorAll('[data-mobile-fade]'), { opacity: 0 })
          })

          const tl = gsap.timeline({
            scrollTrigger: { trigger: mobileRoot, start: 'top 85%', once: true },
          })
          tl.from(mobileRoot.querySelectorAll('[data-soft-blur-char]'), {
            opacity: 0,
            y: 16,
            filter: 'blur(12px)',
            duration: 0.9,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.025,
          })
            .from(
              mobileRoot.querySelector('[data-mobile-button]'),
              { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' },
              '-=0.5',
            )
            .from(
              mobileRoot.querySelector('[data-mobile-card]'),
              { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' },
              '-=0.45',
            )

          return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
          }
        },
        [DESKTOP_MEDIA_QUERY]: () => {
          const bgLayers = Array.from(stage.querySelectorAll<HTMLElement>('[data-bg-layer]'))
          const captions = Array.from(content.querySelectorAll<HTMLElement>('[data-caption]'))
          const indicator = content.querySelector<HTMLElement>('[data-rail-indicator]')
          const dot = content.querySelector<HTMLElement>('[data-rail-dot]')
          const captionWords = captions.map((c) =>
            Array.from(c.querySelectorAll<HTMLElement>('[data-desc-word]')),
          )
          const triggers: ScrollTrigger[] = []

          // The first caption's words start visible immediately (no tween — see below for why),
          // the rest wait offscreen (same soft-blur rise as every reveal in this codebase) until
          // the scrub timeline brings them in.
          gsap.set(captionWords[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
          captionWords.slice(1).forEach((words) => {
            gsap.set(words, { opacity: 0, y: 10, filter: 'blur(8px)' })
          })

          // 1. Entrance — tag wipe, heading soft-blur, tab list fade up, and the first photo
          //    settles in from a slightly zoomed-in state. The first caption is set visible
          //    immediately above (not tweened in) so it can never be caught mid-flight by the
          //    tab-switching timeline below if the user scrolls fast enough to cross both
          //    triggers at once. This fires once and never replays; scrolling further never
          //    touches the heading/button.
          gsap
            .timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } })
            .from(bgLayers[0], { scale: 1.15, duration: 1.4, ease: 'power2.out' }, 0)
            .from(
              content.querySelectorAll('[data-wipe-tag]'),
              {
                width: 0,
                paddingLeft: 0,
                paddingRight: 0,
                duration: 0.55,
                ease: 'sine.inOut',
              },
              0,
            )
            .from(
              content.querySelectorAll('[data-soft-blur-char]'),
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
              content.querySelectorAll('[data-line-reveal]'),
              {
                opacity: 0,
                y: 14,
                filter: 'blur(8px)',
                duration: 0.7,
                ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
                stagger: 0.08,
              },
              0.3,
            )

          // 2. Tab switching — NOT scrubbed. Each tab holds for a dead zone of extra scroll (~3
          //    wheel notches, HOLD_PX), then the scroll that crosses the boundary triggers one
          //    quick, self-contained cut: background photo crossfade, caption words stagger
          //    out/in, and the rail indicator slides to the next tab — all playing to completion
          //    on their own regardless of further scroll input. Scrolling back up past the
          //    boundary reverses the same cut.
          for (let i = 0; i < PLATFORM_TABS.length - 1; i++) {
            const tl = gsap.timeline({ paused: true })
            tl.to(bgLayers[i], { opacity: 0, duration: 0.35, ease: 'power1.inOut' }, 0)
            tl.to(bgLayers[i + 1], { opacity: 1, duration: 0.35, ease: 'power1.inOut' }, 0)
            tl.to(
              captionWords[i],
              { opacity: 0, y: -6, filter: 'blur(6px)', duration: 0.15, ease: 'power1.in', stagger: 0.012 },
              0,
            )
            tl.fromTo(
              captionWords[i + 1],
              { opacity: 0, y: 10, filter: 'blur(8px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.2, ease: 'power2.out', stagger: 0.02 },
              0.15,
            )
            if (indicator) tl.to(indicator, { top: indicatorTop(i + 1), duration: 0.35, ease: 'power1.inOut' }, 0)
            if (dot) tl.to(dot, { top: dotTop(i + 1), duration: 0.35, ease: 'power1.inOut' }, 0)

            const offset = HOLD_PX * (i + 1)
            const trigger = ScrollTrigger.create({
              trigger: root,
              start: `top+=${offset} top`,
              end: `top+=${offset + 1} top`,
              onEnter: () => tl.play(),
              onLeaveBack: () => tl.reverse(),
            })
            triggers.push(trigger)
          }

          return () => {
            triggers.forEach((t) => t.kill())
          }
        },
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.ourPlatform} data-testid="our-platform" ref={rootRef}>
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.bgLayers}>
          {PLATFORM_TABS.map((tab, i) => (
            <img
              key={tab.id}
              src={tab.image}
              alt=""
              className={styles.bgImage}
              data-bg-layer
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
        </div>
        <div className={styles.overlay} />

        <div className={styles.canvas}>
          <div className={styles.content} ref={contentRef}>
            <span className={styles.tag} data-wipe-tag data-testid="our-platform-tag">
              <span className={styles.tagLabel}>{t.ourPlatform.chipLabel}</span>
            </span>

            <div className={styles.rail}>
              <span className={styles.railLine} />
              <span
                className={styles.railIndicator}
                data-rail-indicator
                style={{ top: indicatorTop(0) }}
              />
              <span className={styles.railDot} data-rail-dot style={{ top: dotTop(0) }} />
              <ul className={styles.tabList}>
                {PLATFORM_TABS.map((tab, i) => (
                  <li key={tab.id} className={styles.tabItem} data-line-reveal>
                    {t.ourPlatform.tabs[i].label}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.captionStack}>
              {PLATFORM_TABS.map((tab, i) => (
                <p key={tab.id} className={styles.caption} data-caption>
                  <AnimatedWords text={t.ourPlatform.tabs[i].captionLines[0]} />
                  <br />
                  <AnimatedWords text={t.ourPlatform.tabs[i].captionLines[1]} />
                </p>
              ))}
            </div>

            <div className={styles.heroText}>
              <h2 className={styles.heading}>
                <AnimatedChars text={t.ourPlatform.heading} />
              </h2>
              <CircleRevealButton
                label={t.ourPlatform.cta}
                icon={arrowIcon}
                iconPosition="end"
                variant="light"
                startOnScroll
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mobileView} ref={mobileRootRef}>
        <div className={styles.mobileHead}>
          <h2 className={styles.mobileHeading}>
            <AnimatedChars text={t.ourPlatform.heading} />
          </h2>
          <span data-mobile-button>
            <CircleRevealButton
              label={t.ourPlatform.cta}
              icon={arrowIcon}
              iconPosition="end"
              variant="darkPurple"
              startOnScroll
            />
          </span>
        </div>

        <div className={styles.mobileCardGroup} data-mobile-card>
          <div
            className={styles.mobileCard}
            ref={mobileCardRef}
            data-testid="our-platform-mobile-card"
          >
            <div className={styles.mobileImageBox}>
              {PLATFORM_TABS.map((tab, i) => (
                <img
                  key={tab.id}
                  src={tab.image}
                  alt=""
                  className={styles.mobileImage}
                  ref={(el) => void (mobileImageRefs.current[i] = el)}
                />
              ))}
              <span className={styles.mobileOverlay} />
              <span className={styles.mobileChip}>{t.ourPlatform.chipLabel}</span>
            </div>

            <div className={styles.mobileTextStack}>
              {PLATFORM_TABS.map((tab, i) => (
                <div
                  key={tab.id}
                  className={styles.mobileTextPane}
                  ref={(el) => void (mobilePaneRefs.current[i] = el)}
                >
                  <p className={styles.mobileCardTitle} data-mobile-fade>
                    {t.ourPlatform.tabs[i].label}
                  </p>
                  <p className={styles.mobileCardDesc} data-mobile-fade>
                    <AnimatedWords
                      text={`${t.ourPlatform.tabs[i].captionLines[0]} ${t.ourPlatform.tabs[i].captionLines[1]}`}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mobileFooter}>
            <span className={styles.mobileCounter}>
              {mobileIndex + 1}/{PLATFORM_TABS.length}
            </span>
            <div className={styles.mobileNav}>
              <button
                type="button"
                className={styles.mobileNavBtn}
                onClick={() => goMobile(-1)}
                disabled={mobileIndex === 0}
                aria-label="Previous"
              >
                <img src={arrowLeft} alt="" />
              </button>
              <button
                type="button"
                className={styles.mobileNavBtn}
                onClick={() => goMobile(1)}
                disabled={mobileIndex === PLATFORM_TABS.length - 1}
                aria-label="Next"
              >
                <img src={arrowRight} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
