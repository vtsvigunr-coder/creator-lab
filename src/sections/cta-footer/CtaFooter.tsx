import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { clampApexRadius, peakedEdgeClipPath } from '../../lib/peakedEdgeClipPath'
import CircleRevealButton from '../hero/CircleRevealButton'
import ctaBg from '../../assets/images/cta-section.webp'
import ctaForeground from '../../assets/images/cta-section-without-background.webp'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'
import { NAV_LINKS, SOCIAL_ICONS, scrollToSection } from '../../lib/siteLinks'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './CtaFooter.module.css'

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

// Same rise-and-pin mechanics run on both sides of this line — only the CSS (see the
// `max-width: 900px` block in the stylesheet) resizes the type and reflows the footer bar
// for a narrow column. Nothing about the ScrollTrigger itself differs.
const DESKTOP_MEDIA_QUERY = '(min-width: 901px)'
const MOBILE_MEDIA_QUERY = '(max-width: 900px)'

export default function CtaFooter() {
  const { t } = useTranslation()
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

      // Identical scrub on both breakpoints — reused as a function only so it isn't typed out
      // twice, not because either side behaves differently.
      //
      // `end` is a function using `window.innerHeight` explicitly rather than the `'bottom
      // bottom'` keyword: GSAP's own keyword math measures the viewport height via a hidden
      // `100vh` probe div, which on some mobile viewports (address-bar resize, or a scaled
      // preview frame) disagrees with `window.innerHeight` — the value that actually governs
      // how far the browser lets the page scroll. When those two disagree, `'bottom bottom'`
      // computes an end target past the real bottom of the page and the rise stalls short no
      // matter how far the user scrolls. Deriving `end` from `window.innerHeight` directly
      // keeps it consistent with the browser's own scroll ceiling on every device. Re-run as a
      // function on every refresh, same as the keyword form would be.
      const createRiseTrigger = () =>
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: () => root.offsetTop + root.offsetHeight - window.innerHeight,
          scrub: true,
          onRefresh: (self) => {
            measure()
            applyProgress(gsap.utils.clamp(0, 1, self.progress))
          },
          onUpdate: (self) => applyProgress(gsap.utils.clamp(0, 1, self.progress)),
        })

      ScrollTrigger.matchMedia({
        [DESKTOP_MEDIA_QUERY]: () => {
          const trigger = createRiseTrigger()
          return () => trigger.kill()
        },
        [MOBILE_MEDIA_QUERY]: () => {
          const trigger = createRiseTrigger()

          // Mobile browser chrome (address bar) hides/shows as the page scrolls, which changes
          // `window.innerHeight` mid-gesture — the value `end` above is built from. A *global*
          // ScrollTrigger.refresh() would keep that honest too, but it re-measures every trigger
          // on the page and was visibly janky when tried. Refreshing just this one instance is
          // cheap enough to do on every resize without that cost, and rAF-coalescing collapses
          // the burst of resize events the address-bar animation fires into one recalculation.
          let raf = 0
          const onResize = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => trigger.refresh())
          }
          window.addEventListener('resize', onResize)

          return () => {
            window.removeEventListener('resize', onResize)
            cancelAnimationFrame(raf)
            trigger.kill()
          }
        },
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

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
                  {t.ctaFooter.headingLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </h2>
                <p className={styles.description}>{t.ctaFooter.description}</p>
              </div>

              <div className={styles.buttons}>
                <CircleRevealButton label={t.ctaFooter.applyAsBrand} icon={basketIcon} variant="light" fluid />
                <CircleRevealButton
                  label={t.ctaFooter.applyAsCreator}
                  icon={videoIcon}
                  variant="outlineLight"
                  fluid
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
              <p className={styles.copyright}>{t.ctaFooter.copyright}</p>

              <nav className={styles.navGlass} aria-label="Footer">
                <span className={styles.navGlassFill} />
                <ul className={styles.navList}>
                  {NAV_LINKS.map((link) => (
                    <li key={link.key}>
                      <button
                        type="button"
                        className={styles.navLink}
                        onClick={() => scrollToSection(link.targetTestId)}
                      >
                        {t.nav.sitemap[link.key]}
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
              {t.nav.legal.map((label, i) => (
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
