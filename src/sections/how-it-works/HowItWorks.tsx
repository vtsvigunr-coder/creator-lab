import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { CHAR_STAGGER, CHAR_START, SOFT_BLUR } from '../../lib/softBlurReveal'
import { AnimatedChars } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import CircleRevealButton from '../hero/CircleRevealButton'
import arrowIcon from '../../assets/icons/arrow-right-02-sharp.svg'
import headingIcon from '../../assets/icons/how-it-works-icon.svg'
import { STEPS } from './steps'
import { useIsMobile } from '../../lib/useIsMobile'
import type { Translations } from '../../i18n/types'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './HowItWorks.module.css'

// How much of the scrubbed range one card spends rising, and how far apart the four are
// dealt. 3 * 0.55 + 1 = 2.65 units of timeline, so the last card lands right at the end.
const CARD_RISE = 1
const CARD_OFFSET = 0.55

// Below this the stage stops pinning (see the `max-width: 640px` block in the stylesheet)
// and the cards sit in normal flow, so there's no scrub range left to deal them against —
// matchMedia switches to a plain per-card reveal instead.
const DESKTOP_MEDIA_QUERY = '(min-width: 641px)'
const MOBILE_MEDIA_QUERY = '(max-width: 640px)'

// The mobile card is wider than the tilted desktop one, so a couple of the Russian titles
// break at a different word there — those steps carry a `titleMobile`.
function stepTitle(step: Translations['howItWorks']['steps'][number], isMobile: boolean) {
  return isMobile && step.titleMobile ? step.titleMobile : step.title
}

export default function HowItWorks() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const rootRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const head = headRef.current
    const cardsEl = cardsRef.current
    if (!root || !head || !cardsEl) return

    const ctx = gsap.context(() => {
      // 1. Heading entrance. The icon carries `data-soft-blur-char` too, so it is simply one
      //    more unit in the same flat, DOM-ordered list: the stagger sweeps left to right
      //    through "Simple on", reaches the icon, then carries straight on into "the
      //    outside." and the second line. One continuous stagger means no seam or pause
      //    where the icon sits.
      const units = Array.from(head.querySelectorAll<HTMLElement>('[data-soft-blur-char]'))
      const iconEl = head.querySelector<HTMLElement>('[data-heading-icon]')
      const iconAt = iconEl ? CHAR_START + units.indexOf(iconEl) * CHAR_STAGGER : 0

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 65%', once: true },
      })
      tl.from(head.querySelectorAll('[data-wipe-tag]'), {
        width: 0,
        paddingLeft: 0,
        paddingRight: 0,
        duration: 0.55,
        ease: 'sine.inOut',
      }).from(units, { ...SOFT_BLUR, stagger: CHAR_STAGGER }, CHAR_START)

      // On top of its turn in the stagger the icon also swings up to size, so it reads as a
      // thing that lands rather than a character that fades. Same easing family, so it stays
      // part of the one gesture.
      if (iconEl) {
        tl.from(
          iconEl,
          { scale: 0.2, rotation: -35, duration: 0.7, ease: 'back.out(1.6)' },
          iconAt,
        )
      }

      // 2. On desktop the cards are scrubbed against the pinned range so they are dealt up one
      //    by one as the user scrolls, and go back down if they scroll up. Each starts well
      //    below the fold, flat and slightly small, and swings into its resting tilt on the
      //    way up — the extra rotation and scale are what give the rise some weight.
      //    On mobile there's no pinned stage to scrub against — the cards sit in normal flow —
      //    so each one instead rises into place on its own the first time it crosses into
      //    view, the same "once" reveal the rest of the page uses.
      const cards = Array.from(cardsEl.querySelectorAll<HTMLElement>('[data-step-card]'))
      ScrollTrigger.matchMedia({
        [DESKTOP_MEDIA_QUERY]: () => {
          // The timeline is built in full before its trigger is attached: handing
          // ScrollTrigger an empty timeline makes it defer initialisation by a tick, which
          // leaves it half-registered while other sections are still mounting.
          const cardsTl = gsap.timeline({ paused: true })
          cards.forEach((card, i) => {
            const rotation = STEPS[i].rotation
            cardsTl.fromTo(
              card,
              { yPercent: 280, rotation: rotation - 16, scale: 0.9 },
              { yPercent: 0, rotation, scale: 1, duration: CARD_RISE, ease: 'power2.out' },
              i * CARD_OFFSET,
            )
          })
          const trigger = ScrollTrigger.create({
            animation: cardsTl,
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          })
          return () => trigger.kill()
        },
        [MOBILE_MEDIA_QUERY]: () => {
          const triggers = cards.map(
            (card) =>
              gsap.fromTo(
                card,
                { opacity: 0, y: 56 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: 'power2.out',
                  scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                },
              ).scrollTrigger,
          )
          return () => triggers.forEach((t) => t?.kill())
        },
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.howItWorks} data-testid="how-it-works" ref={rootRef}>
      <div className={styles.stage}>
        <div className={styles.content} ref={headRef}>
          <WipeRevealTag label={t.howItWorks.tag} />
          <h2 className={styles.heading}>
            <div className={styles.headingLine}>
              <span>
                <AnimatedChars text={t.howItWorks.headingBeforeIcon} />
              </span>
              <img
                className={styles.headingIcon}
                src={headingIcon}
                alt=""
                data-soft-blur-char
                data-heading-icon
              />
              <span>
                <AnimatedChars text={t.howItWorks.headingAfterIcon} />
              </span>
            </div>
            <div>
              <AnimatedChars text={t.howItWorks.headingLine2} />
            </div>
          </h2>
          <CircleRevealButton
            label={t.howItWorks.cta}
            icon={arrowIcon}
            iconPosition="end"
            variant="light"
            startOnScroll
          />
        </div>

        <div className={styles.cards} ref={cardsRef} data-testid="how-it-works-cards">
          {STEPS.map((step, i) => (
            <article
              key={t.howItWorks.steps[i].badge}
              className={styles.card}
              style={{ left: step.left }}
              data-step-card
              data-step={i}
            >
              <div className={styles.cardBody}>
                <span className={styles.cardIcon}>
                  <img src={step.icon} alt="" />
                </span>
                <h3 className={styles.cardTitle}>
                  <span>{stepTitle(t.howItWorks.steps[i], isMobile)[0]}</span>
                  <br />
                  <span>{stepTitle(t.howItWorks.steps[i], isMobile)[1]}</span>
                </h3>
                <p className={styles.cardText}>{t.howItWorks.steps[i].description}</p>
              </div>
              <span className={styles.cardBadge}>{t.howItWorks.steps[i].badge}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
