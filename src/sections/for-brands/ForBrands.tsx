import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import CircleRevealButton from '../hero/CircleRevealButton'
import arrowIcon from '../../assets/icons/arrow-right-02-sharp.svg'
import arrowUpIcon from '../../assets/icons/arrow-up-02-sharp.svg'
import photo from '../../assets/images/for-brands.webp'
import maskShape from '../../assets/icons/for-brands-mask.svg'
import { STATS, type Stat } from './stats'
import styles from './ForBrands.module.css'

const HEADING_LINE_1 = 'Turn creators into'
const HEADING_LINE_2 = 'a real sales channel'
const DESCRIPTION =
  'Creator Lab gives brands a better way to sell through creators without relying on scattered messages, spreadsheet chaos, or blind influencer deals'

const CAN_LIST = [
  'List products in one system',
  'Activate relevant creators',
  'Track clicks, visits, and sales',
  'Understand which creators actually drive results',
  'Centralize creator-led demand into one operational flow',
]

function formatStat(stat: Stat, value: number) {
  const rounded = Math.round(value).toLocaleString('en-US')
  return stat.format === 'currency' ? `$${rounded}` : rounded
}

function formatDelta(value: number) {
  return `+${value.toFixed(1)}%`
}

export default function ForBrands() {
  const rootRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const imageBlockRef = useRef<HTMLDivElement>(null)
  const photoGroupRef = useRef<HTMLDivElement>(null)
  const statCardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const head = headRef.current
    const body = bodyRef.current
    const imageBlock = imageBlockRef.current
    const photoGroup = photoGroupRef.current
    const statCard = statCardRef.current
    if (!root || !head || !body || !imageBlock || !photoGroup || !statCard) return

    const ctx = gsap.context(() => {
      // 1. Head — same tag-wipe, then heading/description reveal shared with every other
      //    section, so the entrance timing reads as one system.
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

      // 2. Body — the bullet list fades up first, then the photo plate fades in empty, and
      //    the photo — already carrying its star mask, the two move as one piece — slides in
      //    from the right on top of it. The stat card lands last, its numbers counting up to
      //    their real values.
      const bodyTl = gsap.timeline({
        scrollTrigger: { trigger: body, start: 'top 80%', once: true },
      })
      bodyTl
        .from(body.querySelectorAll('[data-line-reveal]'), {
          opacity: 0,
          y: 14,
          filter: 'blur(8px)',
          duration: 0.7,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          stagger: 0.08,
        })
        .from(imageBlock, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0.15)
        .from(photoGroup, { xPercent: 100, duration: 0.7, ease: 'power2.out' }, '-=0.1')
        .from(
          statCard,
          {
            opacity: 0,
            y: 16,
            filter: 'blur(12px)',
            duration: 0.9,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          },
          '-=0.25',
        )

      // 3. Stat values (and their delta pills) count up from zero as the card lands, so they
      //    read as live metrics rather than static copy.
      const valueEls = Array.from(statCard.querySelectorAll<HTMLElement>('[data-stat-value]'))
      valueEls.forEach((el, i) => {
        const stat = STATS[i]
        const proxy = { value: 0 }
        bodyTl.to(
          proxy,
          {
            value: stat.target,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = formatStat(stat, proxy.value)
            },
          },
          '<',
        )
      })
      const deltaEls = Array.from(statCard.querySelectorAll<HTMLElement>('[data-stat-delta]'))
      deltaEls.forEach((el, i) => {
        const stat = STATS[i]
        const proxy = { value: 0 }
        bodyTl.to(
          proxy,
          {
            value: stat.delta,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = formatDelta(proxy.value)
            },
          },
          '<',
        )
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.forBrands} data-testid="for-brands" ref={rootRef}>
      <div className={styles.head} ref={headRef}>
        <div className={styles.copy}>
          <div className={styles.tagAndHeading}>
            <WipeRevealTag label="Why brands join" />
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
        <CircleRevealButton
          label="For Brands"
          icon={arrowIcon}
          iconPosition="end"
          variant="solid"
          startOnScroll
        />
      </div>

      <div className={styles.body} ref={bodyRef}>
        <div className={styles.listCol}>
          <p className={styles.listHeading} data-line-reveal>
            With Creator Lab, brands can:
          </p>
          <ul className={styles.list}>
            {CAN_LIST.map((item) => (
              <li key={item} className={styles.listItem} data-line-reveal>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.imageBlock} ref={imageBlockRef} data-testid="for-brands-image">
          <div className={styles.photoGroup} ref={photoGroupRef}>
            <img className={styles.photo} src={photo} alt="" />
            <img className={styles.mask} src={maskShape} alt="" />
          </div>

          <div className={styles.statCard} ref={statCardRef}>
            {STATS.map((stat) => (
              <div className={styles.statRow} key={stat.label}>
                <div className={styles.statMain}>
                  <span className={styles.statIcon} style={{ background: stat.iconBg }}>
                    <img src={stat.icon} alt="" />
                  </span>
                  <span className={styles.statText}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span className={styles.statValue} data-stat-value>
                      {formatStat(stat, 0)}
                    </span>
                  </span>
                </div>
                <span className={styles.statDelta}>
                  <img className={styles.statDeltaIcon} src={arrowUpIcon} alt="" />
                  <span className={styles.statDeltaText} data-stat-delta>
                    {formatDelta(0)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
