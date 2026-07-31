import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { splitChars } from '../../lib/splitChars'
import { LEGAL_LINKS, NAV_LINKS, SOCIAL_ICONS, scrollToSection } from '../../lib/siteLinks'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './NavMenu.module.css'

// Hamburger (3 lines) <-> close (X), both in the icon's 20x20 viewBox. The hamburger's outer
// lines become the X's two diagonals; the middle one collapses to a point at the centre and
// fades, rather than simply disappearing.
const HAMBURGER = {
  top: { x1: 5.834, y1: 4.167, x2: 14.167, y2: 4.167 },
  mid: { x1: 3.334, y1: 10, x2: 16.667, y2: 10 },
  bottom: { x1: 5.834, y1: 15.833, x2: 14.167, y2: 15.833 },
}
const CROSS = {
  top: { x1: 5, y1: 5, x2: 15, y2: 15 },
  mid: { x1: 10, y1: 10, x2: 10, y2: 10 },
  bottom: { x1: 15, y1: 5, x2: 5, y2: 15 },
}

// Traced off the reference implementation: the panel unrolls over ~0.42s on a firm ease-out,
// covering two thirds of the distance in the first third of the time.
const PANEL_DURATION = 0.42
const PANEL_EASE = 'power3.out'

function Chars({ text }: { text: string }) {
  const chars = useMemo(() => splitChars(text), [text])
  return (
    <>
      {chars.map((c, i) => (
        <span key={i} className={styles.char} data-char>
          {c.isSpace ? ' ' : c.char}
        </span>
      ))}
    </>
  )
}

type NavMenuProps = {
  /** 'light' keeps the closed toggle white, for use over photos — see the 404 header. */
  variant?: 'dark' | 'light'
}

export default function NavMenu({ variant = 'dark' }: NavMenuProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLSpanElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const menuLabelRef = useRef<HTMLSpanElement>(null)
  const closeLabelRef = useRef<HTMLSpanElement>(null)
  const lineTopRef = useRef<SVGLineElement>(null)
  const lineMidRef = useRef<SVGLineElement>(null)
  const lineBottomRef = useRef<SVGLineElement>(null)
  const openHeight = useRef(0)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  // The content stays in the layout even when shut (the panel just clips it), so its natural
  // height is readable at any time — no need to un-hide anything to measure.
  useLayoutEffect(() => {
    const measure = () => {
      const clip = clipRef.current
      const content = contentRef.current
      if (!clip || !content) return
      // Top and bottom padding aren't symmetric (the top gets an extra 20px — see
      // NavMenu.module.css), so both are read rather than doubling one.
      const style = getComputedStyle(clip)
      const paddingTop = parseFloat(style.paddingTop) || 20
      const paddingBottom = parseFloat(style.paddingBottom) || 20
      openHeight.current = paddingTop + paddingBottom + content.offsetHeight
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Entrance: the pill's label writes itself on, matching the hero's soft reveal.
  useLayoutEffect(() => {
    const chars = menuLabelRef.current?.querySelectorAll('[data-char]')
    if (!chars) return
    const tl = gsap.from(chars, {
      y: -14,
      opacity: 0,
      duration: 0.4,
      ease: 'cubic-bezier(0.18, 1, 0.32, 1)',
      stagger: 0.088,
    })
    return () => {
      tl.kill()
    }
  }, [])

  useLayoutEffect(() => {
    const clip = clipRef.current
    const scrim = scrimRef.current
    const content = contentRef.current
    const menuLabel = menuLabelRef.current
    const closeLabel = closeLabelRef.current
    const lineTop = lineTopRef.current
    const lineMid = lineMidRef.current
    const lineBottom = lineBottomRef.current
    if (!clip || !scrim || !content || !menuLabel || !closeLabel) return
    if (!lineTop || !lineMid || !lineBottom) return

    // Never let two timelines own the same properties at once — that is what used to leave the
    // panel stranded half-open if the toggle was hit twice in quick succession.
    timeline.current?.kill()

    const menuChars = menuLabel.querySelectorAll('[data-char]')
    const closeChars = closeLabel.querySelectorAll('[data-char]')
    const rows = content.querySelectorAll('[data-row]')
    const tl = gsap.timeline()

    if (open) {
      tl.to(clip, { height: openHeight.current, duration: PANEL_DURATION, ease: PANEL_EASE }, 0)
        .to(scrim, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0)
        .to(lineTop, { attr: CROSS.top, duration: 0.4, ease: 'power2.inOut' }, 0)
        .to(lineBottom, { attr: CROSS.bottom, duration: 0.4, ease: 'power2.inOut' }, 0)
        .to(lineMid, { attr: CROSS.mid, opacity: 0, duration: 0.25, ease: 'power1.out' }, 0)
        // "Menu" keeps rising out of the way while "Close" rises in behind it.
        .to(menuChars, { y: -14, opacity: 0, duration: 0.3, ease: 'power1.in', stagger: 0.03 }, 0)
        .set(closeLabel, { opacity: 1 }, 0.05)
        .fromTo(
          closeChars,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'cubic-bezier(0.18, 1, 0.32, 1)', stagger: 0.04 },
          0.05,
        )
        // The rows are dealt in behind the growing edge, so the panel reads as uncovering them
        // rather than as a box that appears and then fills.
        .fromTo(
          rows,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.045 },
          0.12,
        )
    } else {
      tl.to(rows, { opacity: 0, y: 6, duration: 0.15, ease: 'power1.in' }, 0)
        .to(clip, { height: 0, duration: 0.34, ease: 'power3.inOut' }, 0.05)
        .to(scrim, { opacity: 0, duration: 0.28, ease: 'power1.in' }, 0.05)
        .to(lineTop, { attr: HAMBURGER.top, duration: 0.35, ease: 'power2.inOut' }, 0)
        .to(lineBottom, { attr: HAMBURGER.bottom, duration: 0.35, ease: 'power2.inOut' }, 0)
        .to(lineMid, { attr: HAMBURGER.mid, opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.1)
        .to(closeChars, { y: -14, opacity: 0, duration: 0.25, ease: 'power1.in', stagger: 0.025 }, 0)
        .set(menuLabel, { opacity: 1 }, 0.05)
        .fromTo(
          menuChars,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: 'cubic-bezier(0.18, 1, 0.32, 1)', stagger: 0.035 },
          0.05,
        )
    }

    timeline.current = tl
    return () => {
      tl.kill()
    }
  }, [open])

  // Dismiss on a click outside the panel or on Escape, the two things every menu is expected
  // to do and neither of which the markup gives for free.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (toggleRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const go = (targetTestId?: string) => {
    setOpen(false)
    scrollToSection(targetTestId)
  }

  return (
    <div className={`${styles.root} ${open ? styles.open : ''} ${variant === 'light' ? styles.light : ''}`}>
      <button
        ref={toggleRef}
        className={styles.toggle}
        type="button"
        aria-expanded={open}
        aria-controls="nav-menu-content"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.icon} aria-hidden="true">
          <line ref={lineTopRef} {...HAMBURGER.top} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <line ref={lineMidRef} {...HAMBURGER.mid} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <line
            ref={lineBottomRef}
            {...HAMBURGER.bottom}
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
        <span className={styles.labelStack}>
          <span ref={menuLabelRef}>
            <Chars text={t.nav.menuLabel} />
          </span>
          <span ref={closeLabelRef} className={styles.labelClose}>
            <Chars text={t.nav.closeLabel} />
          </span>
        </span>
      </button>

      {/* Not nested inside the toggle: the disclosure card is its own floating element that
          unrolls below the toggle rather than growing around it, so the toggle always reads
          as a separate, fixed control. .panel is just a positioning frame (auto-height, no
          clip) so .scrim — an own child, not scoped inside the height-animated .clip — can
          extend past its top edge to reach up behind the toggle on desktop without being cut
          off by an overflow:hidden it doesn't own. */}
      <div ref={panelRef} className={styles.panel} data-testid="nav-menu" data-open={open}>
        <span ref={scrimRef} className={styles.scrim} aria-hidden="true" />
        <div ref={clipRef} className={styles.clip}>
        <div id="nav-menu-content" ref={contentRef} className={styles.content} aria-hidden={!open}>
        <div className={styles.block}>
          <div className={`${styles.group} ${styles.groupRuled}`} data-row>
            <span className={styles.groupTitle}>{t.nav.sitemapTitle}</span>
            <ul className={styles.links}>
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <button
                    className={`${styles.link} ${styles.linkLarge}`}
                    type="button"
                    tabIndex={open ? 0 : -1}
                    onClick={() => go(link.targetTestId)}
                  >
                    {t.nav.sitemap[link.key]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.group} data-row>
            <span className={styles.groupTitle}>{t.nav.legalTitle}</span>
            <ul className={styles.links}>
              {/* Cookie Policy (the entry with no real href yet) stays in the footer but is
                  dropped here — the menu only lists pages that actually exist. */}
              {t.nav.legal.map((label, i) =>
                LEGAL_LINKS[i] ? (
                  <li key={label}>
                    <a
                      className={`${styles.link} ${styles.linkSmall}`}
                      href={LEGAL_LINKS[i]}
                      tabIndex={open ? 0 : -1}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </div>

        <div className={styles.group} data-row>
          <span className={styles.groupTitle}>{t.nav.socialTitle}</span>
          <div className={styles.social}>
            {SOCIAL_ICONS.map((social) => (
              <a
                key={social.label}
                className={styles.socialLink}
                href="#"
                tabIndex={open ? 0 : -1}
                onClick={(e) => e.preventDefault()}
              >
                <img className={styles.socialIcon} src={social.icon} alt={social.label} width={20} height={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Desktop shows this as its own header button; on mobile there's no room for it next
            to the logo, so it rides inside the menu instead. Always in the DOM (rather than
            conditionally mounted) so the height math above already accounts for it — it just
            occupies zero space on desktop via `display: none`. */}
        <div className={styles.getStartedRow} data-row>
          <button
            className={styles.getStarted}
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            {t.nav.getStarted}
          </button>
        </div>
        </div>
        </div>
      </div>
    </div>
  )
}
