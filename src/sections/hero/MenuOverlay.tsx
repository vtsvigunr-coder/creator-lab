import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { splitChars } from '../../lib/splitChars'
import styles from './MenuOverlay.module.css'
import instagramIcon from '../../assets/icons/instagram.svg'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import telegramIcon from '../../assets/icons/telegram.svg'

const SITEMAP = ['How It Works', 'For Brands', 'For Creators', 'Pricing', 'FAQ']
const LEGAL = ['Privacy Policy', 'Terms of Service', 'Cookie Policy']

type MenuOverlayProps = {
  open: boolean
  onOpen: () => void
  onClose: () => void
}

function AnimatedChars({ text }: { text: string }) {
  const chars = useMemo(() => splitChars(text), [text])
  return (
    <>
      {chars.map((c, i) => (
        <span key={i} className={styles.triggerChar} data-trigger-char>
          {c.isSpace ? ' ' : c.char}
        </span>
      ))}
    </>
  )
}

// Hamburger (3 lines) <-> close (X) coordinates, both in the icon's 20x20 viewBox. The
// hamburger's outer lines become the X's two diagonals; the middle line collapses to a
// point at the center and fades, instead of just vanishing.
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

const OPEN_TOP = -20
const OPEN_WIDTH = 279
const BOUNCE = 'back.out(1.5)'

export default function MenuOverlay({ open, onOpen, onClose }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const openContentRef = useRef<HTMLDivElement>(null)
  const lineTopRef = useRef<SVGLineElement>(null)
  const lineMidRef = useRef<SVGLineElement>(null)
  const lineBottomRef = useRef<SVGLineElement>(null)
  const iconRef = useRef<SVGSVGElement>(null)
  const menuLabelRef = useRef<HTMLSpanElement>(null)
  const closeLabelRef = useRef<HTMLSpanElement>(null)
  const closedBox = useRef({ width: 0, height: 0, top: 0 })
  const openHeight = useRef(0)
  const activeTimeline = useRef<ReturnType<typeof gsap.timeline> | null>(null)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const openContent = openContentRef.current
    const toggle = panel?.querySelector('button')
    if (!panel || !openContent || !toggle) return
    if (closedBox.current.width === 0) {
      // The closed pill has no explicit `top` in CSS — its vertical position comes from
      // the flex row's align-items: center (the CSS spec defines the static position of an
      // absolutely-positioned flex child that way). Capture that resolved position once so
      // the open/close tween can animate `top` as a plain number instead of relying on a
      // percentage transform, which would keep re-centering (and overflowing upward) as
      // height grows to the much taller open panel.
      closedBox.current = { width: panel.offsetWidth, height: panel.offsetHeight, top: panel.offsetTop }

      // Measure the real content height instead of a hand-picked constant, so the panel
      // always grows tall enough to fit the toggle row + gap + Sitemap/divider/Legal/Social
      // without clipping, even if that content changes later. Briefly reveal it (still
      // invisible, synchronous within this layout effect so nothing flashes) purely to read
      // scrollHeight. Total = top+bottom padding (40, open state) + toggle row + panel's own
      // 40px gap (only counted once content is visible) + the content's own height.
      const prevDisplay = openContent.style.display
      openContent.style.display = 'flex'
      const panelGap = 40
      const openPadding = 40
      openHeight.current = openPadding + toggle.offsetHeight + panelGap + openContent.scrollHeight
      openContent.style.display = prevDisplay || 'none'
    }
  }, [])

  useLayoutEffect(() => {
    const trigger = menuLabelRef.current?.closest('button')
    if (!trigger) return

    const icon = iconRef.current
    const chars = menuLabelRef.current?.querySelectorAll('[data-trigger-char]')
    const tl = gsap.timeline()

    if (icon) {
      tl.from(icon, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0)
    }
    if (chars) {
      tl.from(
        chars,
        {
          y: -14,
          opacity: 0,
          duration: 0.4,
          ease: 'cubic-bezier(0.18, 1, 0.32, 1)',
          stagger: 0.088,
        },
        0,
      )
    }

    return () => {
      tl.kill()
    }
  }, [])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const openContent = openContentRef.current
    const lineTop = lineTopRef.current
    const lineMid = lineMidRef.current
    const lineBottom = lineBottomRef.current
    const menuLabel = menuLabelRef.current
    const closeLabel = closeLabelRef.current
    if (!panel || !openContent || !lineTop || !lineMid || !lineBottom || !menuLabel || !closeLabel) return

    // Kill whatever the previous run of this effect left behind first. Without this, two
    // timelines can end up simultaneously fighting over the same panel properties (e.g. if
    // this effect ever fires twice in quick succession) and both stall at progress 0 forever.
    activeTimeline.current?.kill()

    const menuChars = menuLabel.querySelectorAll('[data-trigger-char]')
    const closeChars = closeLabel.querySelectorAll('[data-trigger-char]')

    let tl: ReturnType<typeof gsap.timeline>

    if (open) {
      // Pin the panel's box to its current (closed) size FIRST, as an explicit inline
      // style. Only then reveal openContent. Otherwise, the instant `display: flex` below
      // triggers a synchronous reflow to the panel's natural content-based size — and by
      // the time the width/height tween below reads its starting value, the box has
      // already snapped to the target size, so the tween has nothing left to animate.
      gsap.set(panel, {
        width: closedBox.current.width || 239,
        height: closedBox.current.height || 36,
        top: closedBox.current.top,
      })
      gsap.set(openContent, { display: 'flex' })

      tl = gsap
        .timeline()
        .to(
          panel,
          {
            width: OPEN_WIDTH,
            height: openHeight.current,
            top: OPEN_TOP,
            borderRadius: 24,
            duration: 0.6,
            ease: BOUNCE,
          },
          0,
        )
        .to(lineTop, { attr: CROSS.top, duration: 0.4, ease: 'power2.inOut' }, 0)
        .to(lineBottom, { attr: CROSS.bottom, duration: 0.4, ease: 'power2.inOut' }, 0)
        .to(lineMid, { attr: CROSS.mid, opacity: 0, duration: 0.25, ease: 'power1.out' }, 0)
        // The label swap mirrors the initial "Menu" reveal (chars rising into place while
        // fading in) so opening feels like a continuation of the same motion, just upward:
        // outgoing "Menu" chars keep rising and fade out, incoming "Close" chars rise up
        // from below into the same spot.
        .to(menuChars, { y: -14, opacity: 0, duration: 0.3, ease: 'power1.in', stagger: 0.03 }, 0)
        .set(closeLabel, { opacity: 1 }, 0.05)
        .fromTo(
          closeChars,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'cubic-bezier(0.18, 1, 0.32, 1)', stagger: 0.04 },
          0.05,
        )
        .to(openContent, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
    } else {
      tl = gsap
        .timeline()
        .to(openContent, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0)
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
        .to(
          panel,
          {
            width: closedBox.current.width || 239,
            height: closedBox.current.height || 36,
            top: closedBox.current.top,
            borderRadius: 60,
            duration: 0.5,
            ease: BOUNCE,
          },
          0,
        )
        .set(openContent, { display: 'none' })
    }

    activeTimeline.current = tl

    return () => {
      tl.kill()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, onClose])

  return (
    <div ref={panelRef} className={`${styles.panel} ${open ? styles.panelOpen : ''}`} data-testid="menu-overlay">
      <button className={styles.toggle} type="button" onClick={open ? onClose : onOpen}>
        <svg
          ref={iconRef}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={styles.iconSvg}
          aria-hidden="true"
        >
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
          <span ref={menuLabelRef} className={styles.labelLayer}>
            <AnimatedChars text="Menu" />
          </span>
          <span ref={closeLabelRef} className={`${styles.labelLayer} ${styles.closeLabel}`}>
            <AnimatedChars text="Close" />
          </span>
        </span>
      </button>
      <div ref={openContentRef} className={styles.openContent}>
        <div className={styles.group}>
          <span className={styles.groupTitle}>Sitemap</span>
          <div className={styles.links}>
            {SITEMAP.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.group}>
          <span className={styles.groupTitle}>Legal</span>
          <div className={styles.links}>
            {LEGAL.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className={styles.group}>
          <span className={styles.groupTitle}>Social</span>
          <div className={styles.social}>
            <img src={instagramIcon} alt="Instagram" width={20} height={20} />
            <img src={linkedinIcon} alt="LinkedIn" width={20} height={20} />
            <img src={telegramIcon} alt="Telegram" width={20} height={20} />
          </div>
        </div>
      </div>
    </div>
  )
}
