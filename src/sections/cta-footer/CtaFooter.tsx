import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import CircleRevealButton from '../hero/CircleRevealButton'
import ctaBg from '../../assets/images/cta-section.png'
import ctaFg from '../../assets/images/cta-section-without-background.png'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'
import instagramIcon from '../../assets/icons/instagram.svg'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import xIcon from '../../assets/icons/x.svg'
import telegramIcon from '../../assets/icons/telegram.svg'
import styles from './CtaFooter.module.css'

const HEADING_LINES = ['Join the next', 'layer of commerce', 'in Uzbekistan']
const DESCRIPTION =
  'Whether you are a brand looking for scalable distribution or a creator looking for structured monetization, Creator Lab is where the system works for you.'

// Labels match the hero menu's sitemap. Pricing has no section yet, so its link is
// rendered but inert rather than pointing at nothing.
const NAV_LINKS: { label: string; targetTestId?: string }[] = [
  { label: 'How It Works', targetTestId: 'how-it-works' },
  { label: 'For Brands', targetTestId: 'for-brands' },
  { label: 'For Creators', targetTestId: 'for-creators' },
  { label: 'Pricing' },
  { label: 'FAQ', targetTestId: 'faq' },
]

const SOCIAL_ICONS = [
  { label: 'Instagram', icon: instagramIcon },
  { label: 'LinkedIn', icon: linkedinIcon },
  { label: 'X', icon: xIcon },
  { label: 'Telegram', icon: telegramIcon },
]

// Peak height of the centre pull, as a fraction of the mask's own height — same shape as the
// Problem section's photo curtain, just applied to a text block instead and played once
// rather than scrubbed across a pin (see curtainClip there for the full breakdown).
const PEAK = 0.18
const APEX_RADIUS = 160
// How far below its resting position the text starts, in px. The photo itself never moves,
// but the text physically rises this distance — far enough that it starts out behind the
// people in the foreground cutout — while the curtain's own peaked edge wipes across it at
// the same time.
const RISE_PX = 260

function curtainClip(p: number, w: number, h: number) {
  const amp = PEAK * h * (1 - p * p)
  const sideY = (h + amp) * (1 - p)
  const half = w / 2
  const r = Math.min(APEX_RADIUS, half)
  const shoulderY = sideY - amp * (1 - r / half)
  const peakY = sideY - amp
  return `path('M 0 ${sideY} L ${half - r} ${shoulderY} Q ${half} ${peakY} ${half + r} ${shoulderY} L ${w} ${sideY} L ${w} ${h} L 0 ${h} Z')`
}

export default function CtaFooter() {
  const rootRef = useRef<HTMLElement>(null)
  const maskRef = useRef<HTMLDivElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const mask = maskRef.current
    const textBlock = textBlockRef.current
    if (!root || !mask || !textBlock) return

    const ctx = gsap.context(() => {
      // The text itself never fades and never staggers character-by-character — the only
      // things that animate are the curtain's own peaked edge wiping across it, and the
      // block physically rising into place underneath that edge (mirroring how the Problem
      // section's photo is dragged up inside its curtain, just applied to text here).
      const draw = (p: number) => {
        const { width, height } = mask.getBoundingClientRect()
        mask.style.clipPath = curtainClip(p, width, height)
        textBlock.style.transform = `translateY(${(1 - p) * RISE_PX}px)`
      }
      draw(0)

      const proxy = { p: 0 }
      gsap.to(proxy, {
        p: 1,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        onUpdate: () => draw(proxy.p),
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  const scrollToSection = (testId?: string) => {
    if (!testId) return
    document.querySelector(`[data-testid="${testId}"]`)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.ctaFooter} data-testid="cta-footer" ref={rootRef}>
      {/* The photo never moves — it's the one fixed layer everything else is composed over. */}
      <img className={styles.bgImage} src={ctaBg} alt="" />

      <div className={styles.center}>
        <div className={styles.textMask} ref={maskRef} data-testid="cta-text-mask">
          <div className={styles.textBlock} ref={textBlockRef}>
            <h2 className={styles.heading}>
              {HEADING_LINES.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </h2>
            <p className={styles.description}>{DESCRIPTION}</p>
          </div>
        </div>

        <div className={styles.buttons}>
          <CircleRevealButton label="Apply as a Brand" icon={basketIcon} variant="light" startOnScroll />
          <CircleRevealButton
            label="Apply as a Creator"
            icon={videoIcon}
            variant="outlineLight"
            startOnScroll
          />
        </div>
      </div>

      {/* The people, cut out with no background, laid exactly over the photo beneath them —
          since the curtain above reveals the text from the bottom up, the text's rising edge
          passes underneath this layer before it, which is what makes it read as emerging
          from behind them rather than just appearing in front. */}
      <img className={styles.fgImage} src={ctaFg} alt="" />

      <div className={styles.footerBar}>
        <p className={styles.copyright}>© 2026 Creator Lab. All rights reserved.</p>

        <nav className={styles.navGlass} aria-label="Footer">
          <span className={styles.navGlassFill} />
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  className={styles.navLink}
                  onClick={() => scrollToSection(link.targetTestId)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.social}>
          {SOCIAL_ICONS.map((item) => (
            <img key={item.label} className={styles.socialIcon} src={item.icon} alt={item.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
