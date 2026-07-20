import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import CircleRevealButton from '../hero/CircleRevealButton'
import arrowIcon from '../../assets/icons/arrow-right-02-sharp.svg'
import { PLATFORM_TABS } from './tabs'
import styles from './OurPlatform.module.css'

const HEADING = 'Track every sale. Reward every creator'

// How much extra scroll (~3 wheel notches) each tab holds before the cut to the next.
const HOLD_PX = 350

// The rail's vertical rhythm, traced off the Figma frame: tab labels sit 82px apart starting at
// 414px, the indicator bracket is centred on each row, and the dot sits mid-row.
const FIRST_ROW_TOP = 414
const ROW_PITCH = 82
const indicatorTop = (i: number) => FIRST_ROW_TOP + i * ROW_PITCH - 31
const dotTop = (i: number) => FIRST_ROW_TOP + i * ROW_PITCH + 5

export default function OurPlatform() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const content = contentRef.current
    if (!root || !stage || !content) return

    const ctx = gsap.context(() => {
      const bgLayers = Array.from(stage.querySelectorAll<HTMLElement>('[data-bg-layer]'))
      const captions = Array.from(content.querySelectorAll<HTMLElement>('[data-caption]'))
      const indicator = content.querySelector<HTMLElement>('[data-rail-indicator]')
      const dot = content.querySelector<HTMLElement>('[data-rail-dot]')
      const captionWords = captions.map((c) => Array.from(c.querySelectorAll<HTMLElement>('[data-desc-word]')))

      // The first caption's words start visible immediately (no tween — see below for why),
      // the rest wait offscreen (same soft-blur rise as every reveal in this codebase) until
      // the scrub timeline brings them in.
      gsap.set(captionWords[0], { opacity: 1, y: 0, filter: 'blur(0px)' })
      captionWords.slice(1).forEach((words) => {
        gsap.set(words, { opacity: 0, y: 10, filter: 'blur(8px)' })
      })

      // 1. Entrance — tag wipe, heading soft-blur, tab list fade up, and the first photo settles
      //    in from a slightly zoomed-in state. The first caption is set visible immediately
      //    above (not tweened in) so it can never be caught mid-flight by the tab-switching
      //    timeline below if the user scrolls fast enough to cross both triggers at once. This
      //    fires once and never replays; scrolling further never touches the heading/button.
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
      //    out/in, and the rail indicator slides to the next tab — all playing to completion on
      //    their own regardless of further scroll input. Scrolling back up past the boundary
      //    reverses the same cut.
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
        ScrollTrigger.create({
          trigger: root,
          start: `top+=${offset} top`,
          end: `top+=${offset + 1} top`,
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
        })
      }
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
              <span className={styles.tagLabel}>Our platform</span>
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
                {PLATFORM_TABS.map((tab) => (
                  <li key={tab.id} className={styles.tabItem} data-line-reveal>
                    {tab.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.captionStack}>
              {PLATFORM_TABS.map((tab) => (
                <p key={tab.id} className={styles.caption} data-caption>
                  <AnimatedWords text={tab.captionLines[0]} />
                  <br />
                  <AnimatedWords text={tab.captionLines[1]} />
                </p>
              ))}
            </div>

            <div className={styles.heroText}>
              <h2 className={styles.heading}>
                <AnimatedChars text={HEADING} />
              </h2>
              <CircleRevealButton
                label="Explore the Platform"
                icon={arrowIcon}
                iconPosition="end"
                variant="light"
                startOnScroll
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
