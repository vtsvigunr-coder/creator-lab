import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { splitChars } from '../../lib/splitChars'
import styles from './MenuOverlay.module.css'
import menuIcon from '../../assets/icons/menu-04.svg'
import closeIcon from '../../assets/icons/close-icon.svg'
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

function AnimatedMenuChars({ text }: { text: string }) {
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

const OPEN_TOP = -20
const OPEN_WIDTH = 320
const BOUNCE = 'back.out(1.5)'

export default function MenuOverlay({ open, onOpen, onClose }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const openContentRef = useRef<HTMLDivElement>(null)
  const menuIconRef = useRef<HTMLImageElement>(null)
  const closeIconRef = useRef<HTMLImageElement>(null)
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

    const icon = menuIconRef.current
    const chars = trigger.querySelectorAll('[data-trigger-char]')
    const tl = gsap.timeline()

    if (icon) {
      tl.from(icon, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0)
    }
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

    return () => {
      tl.kill()
    }
  }, [])

  useLayoutEffect(() => {
    const panel = panelRef.current
    const openContent = openContentRef.current
    const menuIconEl = menuIconRef.current
    const closeIconEl = closeIconRef.current
    const menuLabel = menuLabelRef.current
    const closeLabel = closeLabelRef.current
    if (!panel || !openContent || !menuIconEl || !closeIconEl || !menuLabel || !closeLabel) return

    // Kill whatever the previous run of this effect left behind first. Without this, two
    // timelines can end up simultaneously fighting over the same panel properties (e.g. if
    // this effect ever fires twice in quick succession) and both stall at progress 0 forever.
    activeTimeline.current?.kill()

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
        .to(menuIconEl, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0)
        .to(closeIconEl, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.1)
        .to(menuLabel, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0)
        .to(closeLabel, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.1)
        .to(openContent, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
    } else {
      tl = gsap
        .timeline()
        .to(openContent, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0)
        .to(closeIconEl, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0)
        .to(menuIconEl, { opacity: 1, duration: 0.2, ease: 'power1.out' }, 0.1)
        .to(closeLabel, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0)
        .to(menuLabel, { opacity: 1, duration: 0.2, ease: 'power1.out' }, 0.1)
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
        <span className={styles.iconStack}>
          <img ref={menuIconRef} src={menuIcon} alt="" width={20} height={20} className={styles.iconLayer} />
          <img
            ref={closeIconRef}
            src={closeIcon}
            alt=""
            width={20}
            height={20}
            className={`${styles.iconLayer} ${styles.closeIcon}`}
          />
        </span>
        <span className={styles.labelStack}>
          <span ref={menuLabelRef} className={styles.labelLayer}>
            <AnimatedMenuChars text="Menu" />
          </span>
          <span ref={closeLabelRef} className={`${styles.labelLayer} ${styles.closeLabel}`}>
            Close
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
