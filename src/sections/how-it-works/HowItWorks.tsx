import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { CHAR_STAGGER, CHAR_START, SOFT_BLUR } from '../../lib/softBlurReveal'
import { AnimatedChars } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import CircleRevealButton from '../hero/CircleRevealButton'
import arrowIcon from '../../assets/icons/arrow-right-02-sharp.svg'
import headingIcon from '../../assets/icons/how-it-works-icon.svg'
import { STEPS } from './steps'
import styles from './HowItWorks.module.css'

const HEADING_BEFORE_ICON = 'Simple on'
const HEADING_AFTER_ICON = 'the outside.'
const HEADING_LINE_2 = 'Powerful underneath.'

// How much of the scrubbed range one card spends rising, and how far apart the four are
// dealt. 3 * 0.55 + 1 = 2.65 units of timeline, so the last card lands right at the end.
const CARD_RISE = 1
const CARD_OFFSET = 0.55

export default function HowItWorks() {
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

      // 2. The cards are scrubbed against the pinned range so they are dealt up one by one as
      //    the user scrolls, and go back down if they scroll up. Each starts well below the
      //    fold, flat and slightly small, and swings into its resting tilt on the way up —
      //    the extra rotation and scale are what give the rise some weight.
      //    The timeline is built in full before its trigger is attached: handing
      //    ScrollTrigger an empty timeline makes it defer initialisation by a tick, which
      //    leaves it half-registered while other sections are still mounting.
      const cards = Array.from(cardsEl.querySelectorAll<HTMLElement>('[data-step-card]'))
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
      ScrollTrigger.create({
        animation: cardsTl,
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
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
          <WipeRevealTag label="How it works" />
          <h2 className={styles.heading}>
            <div className={styles.headingLine}>
              <span>
                <AnimatedChars text={HEADING_BEFORE_ICON} />
              </span>
              <img
                className={styles.headingIcon}
                src={headingIcon}
                alt=""
                data-soft-blur-char
                data-heading-icon
              />
              <span>
                <AnimatedChars text={HEADING_AFTER_ICON} />
              </span>
            </div>
            <div>
              <AnimatedChars text={HEADING_LINE_2} />
            </div>
          </h2>
          <CircleRevealButton
            label="Explore the System"
            icon={arrowIcon}
            iconPosition="end"
            variant="light"
            startOnScroll
          />
        </div>

        <div className={styles.cards} ref={cardsRef} data-testid="how-it-works-cards">
          {STEPS.map((step) => (
            <article
              key={step.badge}
              className={styles.card}
              style={{ left: step.left }}
              data-step-card
            >
              <div className={styles.cardBody}>
                <span className={styles.cardIcon}>
                  <img src={step.icon} alt="" />
                </span>
                <h3 className={styles.cardTitle}>
                  <span>{step.title[0]}</span>
                  <br />
                  <span>{step.title[1]}</span>
                </h3>
                <p className={styles.cardText}>{step.description}</p>
              </div>
              <span className={styles.cardBadge}>{step.badge}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
