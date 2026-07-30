import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import CircleRevealButton from '../hero/CircleRevealButton'
import faqImage from '../../assets/images/faq-section.webp'
import messageIcon from '../../assets/icons/message-multiple-01.svg'
import plusIcon from '../../assets/icons/plus-sign.svg'
import minusIcon from '../../assets/icons/minus-sign.svg'
import { FAQ_ITEMS } from './faqItems'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './Faq.module.css'

export default function Faq() {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const imageBoxRef = useRef<HTMLDivElement>(null)
  const framePathRef = useRef<SVGPathElement>(null)
  const glyphRef = useRef<SVGGElement>(null)

  // First question open by default, per spec — not the second one shown open in Figma.
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id)

  useLayoutEffect(() => {
    const root = rootRef.current
    const left = leftRef.current
    const right = rightRef.current
    const imageBox = imageBoxRef.current
    const framePath = framePathRef.current
    const glyph = glyphRef.current
    if (!root || !left || !right || !imageBox || !framePath || !glyph) return

    const ctx = gsap.context(() => {
      // The frame draws itself: a real stroke reveal driven by dasharray/dashoffset, not a
      // clip or mask, so it traces the exact rounded-rect path frame-by-frame like the
      // reference recording.
      // jsdom (used in tests) doesn't implement getTotalLength; fall back to a fixed length
      // that's harmless there since no animation frame is ever actually observed.
      const length =
        typeof framePath.getTotalLength === 'function' ? framePath.getTotalLength() : 700
      gsap.set(framePath, { strokeDasharray: length, strokeDashoffset: length })
      gsap.set(glyph, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })

      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 65%', once: true } })

      // 1. The photo settles in first...
      tl.from(imageBox, { opacity: 0, scale: 1.08, duration: 0.7, ease: 'power2.out' }, 0)
        // ...then the frame traces around it...
        .to(framePath, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 0.35)
        // ...and the little corner glyph lands right as the line finishes.
        .to(glyph, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' }, '-=0.1')

      // 2. The "still have questions" copy reveals alongside the photo.
      tl.from(
        left.querySelectorAll('[data-desc-word]'),
        {
          opacity: 0,
          y: 10,
          filter: 'blur(8px)',
          duration: 0.6,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          stagger: 0.03,
        },
        0.3,
      )

      // 3. The heading resolves character by character, same treatment as every other
      //    section, then the FAQ rows fade up one by one.
      tl.from(
        right.querySelectorAll('[data-soft-blur-char]'),
        {
          opacity: 0,
          y: 16,
          filter: 'blur(12px)',
          duration: 0.9,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          stagger: 0.025,
        },
        0.15,
      ).from(
        right.querySelectorAll('[data-line-reveal]'),
        {
          opacity: 0,
          y: 14,
          filter: 'blur(8px)',
          duration: 0.7,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          stagger: 0.08,
        },
        0.5,
      )
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.faq} data-testid="faq" ref={rootRef}>
      <div className={styles.left} ref={leftRef}>
        <div className={styles.imageBox} ref={imageBoxRef} data-testid="faq-image">
          <img className={styles.photo} src={faqImage} alt="" />
          <svg className={styles.frameIcon} viewBox="0 0 216 216" fill="none" aria-hidden="true">
            <path
              ref={framePathRef}
              d="M11.6499 173.15C13.1499 168.15 1.65039 170.15 1.65039 164.65V5.6499C1.65039 3.44076 3.44125 1.6499 5.65039 1.6499H209.65C211.86 1.6499 213.65 3.44076 213.65 5.6499V209.65C213.65 211.859 211.86 213.65 209.65 213.65H5.65039C3.44125 213.65 1.65039 211.859 1.65039 209.65V196.15"
              stroke="white"
              strokeWidth="3.3"
            />
            <g ref={glyphRef}>
              <path
                d="M9.01902 160.019L9.01911 174.75C9.01912 175.97 10.0078 176.959 11.2273 176.959L22.2683 176.959C23.4879 176.959 24.4766 175.97 24.4766 174.75L24.4765 160.019L16.7477 167.695L9.01902 160.019Z"
                fill="white"
              />
              <path
                d="M24.8438 160.018C24.8437 159.87 24.7545 159.736 24.6174 159.678C24.4802 159.621 24.322 159.652 24.2165 159.757L16.7471 167.176L9.27767 159.757C9.1722 159.652 9.01395 159.621 8.87676 159.678C8.73964 159.735 8.65047 159.87 8.6504 160.018L8.6504 174.749C8.65041 176.173 9.80385 177.327 11.2267 177.327L22.2675 177.327C23.6903 177.327 24.8438 176.173 24.8438 174.749L24.8438 160.018ZM11.2267 176.591C10.2104 176.591 9.38654 175.766 9.38653 174.749L9.38653 160.903L16.4877 167.956C16.6312 168.099 16.863 168.099 17.0065 167.956L24.108 160.903L24.108 174.749C24.108 175.766 23.2838 176.591 22.2675 176.591L11.2267 176.591Z"
                fill="white"
              />
            </g>
          </svg>
        </div>

        <div className={styles.textBlock}>
          <p className={styles.copy}>
            <AnimatedWords text={t.faq.copyLine1} />
            <br />
            <AnimatedWords text={t.faq.copyLine2} />
          </p>
          <CircleRevealButton
            label={t.faq.cta}
            icon={messageIcon}
            iconPosition="start"
            variant="solid"
            startOnScroll
          />
        </div>
      </div>

      <div className={styles.right} ref={rightRef}>
        <h2 className={styles.heading}>
          <AnimatedChars text={t.faq.heading} />
        </h2>

        <div className={styles.list}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = item.id === openId
            return (
              <div className={styles.item} key={item.id} data-line-reveal>
                <button
                  type="button"
                  className={styles.itemHead}
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span className={styles.question}>{t.faq.items[i].question}</span>
                  <img
                    className={styles.toggleIcon}
                    src={isOpen ? minusIcon : plusIcon}
                    alt=""
                  />
                </button>
                <div
                  className={`${styles.answerWrap} ${isOpen ? styles.open : ''}`}
                  data-testid="faq-answer-wrap"
                >
                  <div className={styles.answerInner}>
                    <p className={styles.answer}>{t.faq.items[i].answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
