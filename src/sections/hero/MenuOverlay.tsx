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

const OPEN_TOP = -20
const OPEN_SIZE = { width: 320, height: 420 }

export default function MenuOverlay({ open, onOpen, onClose }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const openContentRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closedBox = useRef({ width: 0, height: 0, top: 0 })

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (closedBox.current.width === 0) {
      // The closed pill has no explicit `top` in CSS — its vertical position comes from
      // the flex row's align-items: center (the CSS spec defines the static position of an
      // absolutely-positioned flex child that way). Capture that resolved position once so
      // the open/close tween can animate `top` as a plain number instead of relying on a
      // percentage transform, which would keep re-centering (and overflowing upward) as
      // height grows to the much taller open panel.
      closedBox.current = { width: panel.offsetWidth, height: panel.offsetHeight, top: panel.offsetTop }
    }
  }, [])

  useLayoutEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const icon = trigger.querySelector('img')
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
    const trigger = triggerRef.current
    const openContent = openContentRef.current
    const body = bodyRef.current
    if (!panel || !trigger || !openContent || !body) return

    if (open) {
      gsap.set(trigger, { display: 'none' })
      gsap.set(openContent, { display: 'flex' })
      gsap.set(panel, { top: closedBox.current.top })

      gsap
        .timeline()
        .to(panel, {
          width: OPEN_SIZE.width,
          height: OPEN_SIZE.height,
          top: OPEN_TOP,
          borderRadius: 24,
          duration: 0.6,
          ease: 'back.out(1.4)',
        })
        .to(body, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
    } else {
      gsap
        .timeline()
        .to(body, { opacity: 0, duration: 0.15, ease: 'power1.in' })
        .to(panel, {
          width: closedBox.current.width || 239,
          height: closedBox.current.height || 36,
          top: closedBox.current.top,
          borderRadius: 60,
          duration: 0.4,
          ease: 'power2.inOut',
        })
        .set(openContent, { display: 'none' })
        .set(trigger, { display: 'flex' })
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
      <button ref={triggerRef} className={styles.trigger} type="button" onClick={onOpen}>
        <img src={menuIcon} alt="" width={20} height={20} />
        <span className={styles.triggerWord}>
          <AnimatedChars text="Menu" />
        </span>
      </button>
      <div ref={openContentRef} className={styles.openContent}>
        <button className={styles.closeRow} type="button" onClick={onClose}>
          <img src={closeIcon} alt="" width={20} height={20} />
          Close
        </button>
        <div className={styles.body} ref={bodyRef}>
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
    </div>
  )
}
