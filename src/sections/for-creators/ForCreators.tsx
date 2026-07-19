import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import CircleRevealButton from '../hero/CircleRevealButton'
import EarningsGraph from './EarningsGraph'
import arrowIcon from '../../assets/icons/arrow-right-02-sharp.svg'
import arrowUpIcon from '../../assets/icons/arrow-up-02-sharp.svg'
import linkIcon from '../../assets/icons/link-04.svg'
import copyIcon from '../../assets/icons/copy-01.svg'
import photo from '../../assets/images/for-creators.webp'
import styles from './ForCreators.module.css'

const HEADING_LINE_1 = 'Turn influence into'
const HEADING_LINE_2 = 'structured income'
const DESCRIPTION =
  'Creators should not have to rely on random deals, unclear terms, and late payments to earn online'

const CAN_LIST = [
  'Access to brand and product opportunities',
  'A verified creator profile',
  'Trackable links and campaign visibility',
  'Earnings clarity',
  'Long-term reputation and growth inside a real ecosystem',
]

const TRACKED_LINK = 'my.link/skincare'
const EARNINGS_TARGET = 3246.75
const EARNINGS_DELTA_TARGET = 24
// The "today" marker rests at x=133.07 of the 185-wide graph viewBox. The line-earn marker image
// has its own dot centred ~3.25px into its 7px width, so its `left` must land 3.25px short of
// that x for the dot to line up; the area-fill reveal rect stops at the same x.
const GRAPH_REVEAL_X = 133
const GRAPH_MARKER_LEFT = 129.8

function formatEarnings(value: number) {
  return `$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDelta(value: number) {
  return `${Math.round(value)}%`
}

export default function ForCreators() {
  const rootRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const imageBlockRef = useRef<HTMLDivElement>(null)
  const trackedCardRef = useRef<HTMLDivElement>(null)
  const earningsCardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const head = headRef.current
    const body = bodyRef.current
    const imageBlock = imageBlockRef.current
    const trackedCard = trackedCardRef.current
    const earningsCard = earningsCardRef.current
    if (!root || !head || !body || !imageBlock || !trackedCard || !earningsCard) return

    const ctx = gsap.context(() => {
      // 1. Head — same tag-wipe / heading / description reveal shared with every other section.
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

      // 2. Body — the photo fades in with a slight expansion, then the two floating cards land
      //    staggered after it, then the perk list fades up.
      const bodyTl = gsap.timeline({
        scrollTrigger: { trigger: body, start: 'top 80%', once: true },
      })
      bodyTl
        .from(imageBlock, { opacity: 0, scale: 0.94, duration: 0.6, ease: 'power1.out' })
        .from(
          trackedCard,
          { opacity: 0, y: 14, filter: 'blur(8px)', duration: 0.7, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
          '-=0.2',
        )
        .from(
          earningsCard,
          { opacity: 0, y: 14, filter: 'blur(8px)', duration: 0.7, ease: 'cubic-bezier(0.22, 1, 0.36, 1)' },
          '-=0.45',
        )
        .from(
          body.querySelectorAll('[data-line-reveal]'),
          {
            opacity: 0,
            y: 14,
            filter: 'blur(8px)',
            duration: 0.7,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.08,
          },
          '-=0.4',
        )

      // 3. The tracked link types itself in, character by character, as its card lands.
      const linkEl = trackedCard.querySelector<HTMLElement>('[data-link-text]')
      if (linkEl) {
        const proxy = { chars: 0 }
        bodyTl.to(
          proxy,
          {
            chars: TRACKED_LINK.length,
            duration: 0.6,
            ease: 'none',
            onUpdate: () => {
              linkEl.textContent = TRACKED_LINK.slice(0, Math.round(proxy.chars))
            },
          },
          '<+=0.2',
        )
      }

      // 4. The earnings figure and its delta pill count up, while the graph sweeps left to
      //    right — a scan bar leading a clip-rect reveal — landing on the baked-in today marker.
      const valueEl = earningsCard.querySelector<HTMLElement>('[data-earn-value]')
      const deltaEl = earningsCard.querySelector<HTMLElement>('[data-earn-delta]')
      const revealRect = earningsCard.querySelector<SVGRectElement>('[data-graph-reveal-rect]')
      const scanLine = earningsCard.querySelector<HTMLElement>('[data-graph-scan]')

      if (valueEl) {
        const proxy = { value: 0 }
        bodyTl.to(
          proxy,
          {
            value: EARNINGS_TARGET,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              valueEl.textContent = formatEarnings(proxy.value)
            },
          },
          '-=0.5',
        )
      }
      if (deltaEl) {
        const proxy = { value: 0 }
        bodyTl.to(
          proxy,
          {
            value: EARNINGS_DELTA_TARGET,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              deltaEl.textContent = formatDelta(proxy.value)
            },
          },
          '<',
        )
      }
      if (scanLine) {
        bodyTl.to(scanLine, { left: GRAPH_MARKER_LEFT, duration: 1.1, ease: 'power1.inOut' }, '<')
      }
      if (revealRect) {
        bodyTl.to(revealRect, { attr: { width: GRAPH_REVEAL_X }, duration: 1.1, ease: 'power1.inOut' }, '<')
      }
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.forCreators} data-testid="for-creators" ref={rootRef}>
      <div className={styles.head} ref={headRef}>
        <div className={styles.copy}>
          <div className={styles.tagAndHeading}>
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
        <CircleRevealButton
          label="For Creators"
          icon={arrowIcon}
          iconPosition="end"
          variant="solid"
          startOnScroll
        />
      </div>

      <div className={styles.body} ref={bodyRef}>
        <div className={styles.imageBlock} ref={imageBlockRef} data-testid="for-creators-image">
          <img className={styles.photo} src={photo} alt="" />
          <div className={styles.blurPanel} />
          <div className={styles.groundLine} />

          <div className={styles.trackedCard} ref={trackedCardRef}>
            <p className={styles.cardLabel}>Your tracked link</p>
            <div className={styles.linkRow}>
              <div className={styles.linkPill}>
                <span className={styles.linkIconChip}>
                  <img src={linkIcon} alt="" className={styles.linkIcon} />
                </span>
                <span className={styles.linkText} data-link-text />
              </div>
              <span className={styles.copyBtn}>
                <img src={copyIcon} alt="" className={styles.copyIcon} />
              </span>
            </div>
          </div>

          <div className={styles.earningsCard} ref={earningsCardRef}>
            <p className={styles.cardLabel}>Earnings this month</p>
            <div className={styles.earningsRow}>
              <span className={styles.earningsValue} data-earn-value>
                {formatEarnings(0)}
              </span>
              <span className={styles.deltaPill}>
                <img src={arrowUpIcon} alt="" className={styles.deltaIcon} />
                <span className={styles.deltaText} data-earn-delta>
                  {formatDelta(0)}
                </span>
              </span>
            </div>
            <EarningsGraph />
          </div>
        </div>

        <div className={styles.textCol}>
          <p className={styles.listHeading}>Creator Lab gives creators a more professional path:</p>
          <ul className={styles.list}>
            {CAN_LIST.map((item) => (
              <li key={item} className={styles.listItem} data-line-reveal>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
