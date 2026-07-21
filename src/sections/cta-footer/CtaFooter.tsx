import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { clampApexRadius, peakedEdgeClipPath } from '../../lib/peakedEdgeClipPath'
import CircleRevealButton from '../hero/CircleRevealButton'
import ctaBg from '../../assets/images/cta-section.png'
import ctaForeground from '../../assets/images/cta-section-without-background.png'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'
import instagramIcon from '../../assets/icons/instagram.svg'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import xIcon from '../../assets/icons/x.svg'
import telegramIcon from '../../assets/icons/telegram.svg'
import styles from './CtaFooter.module.css'

const HEADING_LINES = ['Join the next', 'layer of commerce', 'in Uzbekistan']
const DESCRIPTION =
  'Whether you are a brand looking for scalable distribution or a creator looking for structured monetization, Creator Lab is where the system works.'

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

// How tall the arched top edge of the rising panel is, in px. Kept in sync with the
// `--arch` custom property in the stylesheet, which reserves the same amount of extra
// height above the stage so that the arch has finished passing the top of the viewport by
// the time the panel comes to rest.
const ARCH = 120
// Width of the rounded apex. Below it the edge runs as a near-straight diagonal, which is
// what gives the reference footer its shallow, wide wave rather than a dome.
const APEX_RADIUS = 160

// The mask is a fixed shape — unlike the Problem section's curtain it never morphs. Only
// its position changes, because the whole panel translates. Returns null while the panel
// hasn't been laid out yet (zero width), so callers can skip clipping rather than writing a
// NaN path.
function archClip(w: number, h: number) {
  if (w <= 0) return null
  const half = w / 2
  const r = clampApexRadius(w, APEX_RADIUS)
  const shoulderY = (ARCH * r) / half
  return peakedEdgeClipPath(w, h, ARCH, 0, shoulderY, r)
}

// Below this width the stage stops pinning (see the `max-width: 900px` block in the
// stylesheet) and the panel is simply parked open, so the scrub has nothing to drive.
const DESKTOP_MEDIA_QUERY = '(min-width: 901px)'

export default function CtaFooter() {
  const rootRef = useRef<HTMLElement>(null)
  const riseRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const rise = riseRef.current
    const photo = photoRef.current
    const foreground = foregroundRef.current
    if (!root || !rise || !photo || !foreground) return

    const ctx = gsap.context(() => {
      // ARCH is the one source of truth for the arch height; the stylesheet's `--arch` only
      // reserves matching space for it, so it's set from here rather than duplicated as a
      // literal in the CSS.
      root.style.setProperty('--arch', `${ARCH}px`)

      // Only the layout read and the clip-path (both expensive, both only ever change when
      // the box is resized) live here. `applyProgress`, called on every scroll tick, just
      // writes transforms against the height this already measured.
      let height = 0
      const measure = () => {
        const rect = rise.getBoundingClientRect()
        height = rect.height
        const clip = archClip(rect.width, rect.height)
        if (clip) rise.style.clipPath = clip
      }

      // The whole footer — arched mask, copy, buttons, nav — is one rigid block that slides
      // straight up out of the bottom of the viewport, exactly like the reference site's
      // footer. Nothing inside it animates on its own: no text reveal, no button entrance,
      // no morphing mask. The only moving part is this one translation.
      //
      // The photo layers are the mirror image of it: they get the inverse translation, so
      // while the panel rides up they stay nailed to the viewport and the copy appears to
      // travel up across a stationary photograph.
      const applyProgress = (p: number) => {
        const dy = (1 - p) * height
        rise.style.transform = `translate3d(0, ${dy}px, 0)`
        const hold = `translate3d(0, ${-dy}px, 0)`
        photo.style.transform = hold
        foreground.style.transform = hold
      }

      measure()
      applyProgress(0)

      // Below 900px the stage stops pinning and the panel is just parked open (see the
      // stylesheet), so there's nothing for a scrub to drive — matchMedia keeps the
      // ScrollTrigger from existing at all on mobile, rather than running it and relying on
      // CSS `!important` to hide the result.
      ScrollTrigger.matchMedia({
        [DESKTOP_MEDIA_QUERY]: () => {
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onRefresh: (self) => {
              measure()
              applyProgress(gsap.utils.clamp(0, 1, self.progress))
            },
            onUpdate: (self) => applyProgress(gsap.utils.clamp(0, 1, self.progress)),
          })
          return () => trigger.kill()
        },
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
      <div className={styles.stage}>
        <div className={styles.rise} ref={riseRef} data-testid="cta-rise">
          {/* Inset back to exactly the stage box, so everything below can keep plain
              viewport-relative offsets despite the panel's extra arch height. */}
          <div className={styles.content}>
            <div className={styles.photo} ref={photoRef} data-testid="cta-photo">
              <img className={styles.photoImage} src={ctaBg} alt="" />
            </div>

            <div className={styles.center}>
              <div className={styles.textBlock}>
                <h2 className={styles.heading}>
                  {HEADING_LINES.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </h2>
                <p className={styles.description}>{DESCRIPTION}</p>
              </div>

              <div className={styles.buttons}>
                <CircleRevealButton label="Apply as a Brand" icon={basketIcon} variant="light" />
                <CircleRevealButton
                  label="Apply as a Creator"
                  icon={videoIcon}
                  variant="outlineLight"
                />
              </div>
            </div>

            {/* The same frame with the sky cut away, laid back over the copy so the rising
                heading passes *behind* the two figures. It sits below the footer bar, which
                stays legible on top of them. */}
            <div className={styles.foreground} ref={foregroundRef} aria-hidden="true">
              <img className={styles.photoImage} src={ctaForeground} alt="" />
            </div>

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
                  <img
                    key={item.label}
                    className={styles.socialIcon}
                    src={item.icon}
                    alt={item.label}
                  />
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
          </div>
        </div>
      </div>
    </section>
  )
}
