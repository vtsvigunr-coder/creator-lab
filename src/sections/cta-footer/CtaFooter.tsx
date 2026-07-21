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
const DESCRIPTION_LINES = [
  'Whether you are a brand looking for scalable distribution or a creator',
  'looking for structured monetization, Creator Lab is where the system works.',
]

// Labels match the hero menu's sitemap. Pricing has no section yet, so its link is
// rendered but inert rather than pointing at nothing.
const NAV_LINKS: { label: string; targetTestId?: string }[] = [
  { label: 'How It Works', targetTestId: 'how-it-works' },
  { label: 'For Brands', targetTestId: 'for-brands' },
  { label: 'For Creators', targetTestId: 'for-creators' },
  { label: 'Pricing' },
  { label: 'FAQ', targetTestId: 'faq' },
]

const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Policy']

const SOCIAL_ICONS = [
  { label: 'Instagram', icon: instagramIcon },
  { label: 'LinkedIn', icon: linkedinIcon },
  { label: 'X', icon: xIcon },
  { label: 'Telegram', icon: telegramIcon },
]

// How far below its resting position the whole CTA block starts, in px. The photo itself
// never moves — heading, description, and buttons rise together as one plain block with no
// mask, fade, or per-character reveal, the same way the reference footer's heading and CTA
// button rise as one solid unit rather than being wiped in.
const RISE_PX = 220

export default function CtaFooter() {
  const rootRef = useRef<HTMLElement>(null)
  const riseRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const rise = riseRef.current
    if (!root || !rise) return

    const ctx = gsap.context(() => {
      gsap.set(rise, { y: RISE_PX })
      gsap.to(rise, {
        y: 0,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
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

      <div className={styles.center} ref={riseRef} data-testid="cta-rise">
        <div className={styles.textBlock}>
          <h2 className={styles.heading}>
            {HEADING_LINES.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </h2>
          <p className={styles.description}>
            {DESCRIPTION_LINES.map((line) => (
              <span key={line} className={styles.descriptionLine}>
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.buttons}>
          <CircleRevealButton label="Apply as a Brand" icon={basketIcon} variant="light" />
          <CircleRevealButton label="Apply as a Creator" icon={videoIcon} variant="outlineLight" />
        </div>
      </div>

      {/* The people, cut out with no background, laid exactly over the photo beneath them, so
          the rising block above passes behind them rather than in front. */}
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

      <ul className={styles.legalRow}>
        {LEGAL_LINKS.map((label, i) => (
          <li key={label} className={styles.legalItem}>
            {i > 0 && <span className={styles.legalDot} aria-hidden="true" />}
            <a className={styles.legalLink} href="#">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
