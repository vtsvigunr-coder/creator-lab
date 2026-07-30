import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { CHAR_STAGGER, CHAR_START, SOFT_BLUR } from '../../lib/softBlurReveal'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import titleImg from '../../assets/images/why-now-title-img.webp'
import bento1 from '../../assets/images/why-now-bento-1.webp'
import bento2 from '../../assets/images/why-now-bento-mobile.webp'
import bento3 from '../../assets/images/why-now-bento-3.webp'
import bento4 from '../../assets/images/why-now-bento-4.webp'
import bento5 from '../../assets/images/why-now-bento-5.webp'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './WhyNow.module.css'

export default function WhyNow() {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const head = headRef.current
    const panel = panelRef.current
    if (!root || !head || !panel) return

    const ctx = gsap.context(() => {
      // 1. Heading entrance — the inline photo is a `data-soft-blur-char` unit like every other
      //    character, so the same left-to-right stagger sweeps through "Built for", reaches the
      //    photo, then carries straight on into "the reality of Uzbekistan" and the subtitle.
      const units = Array.from(head.querySelectorAll<HTMLElement>('[data-soft-blur-char]'))
      const imgEl = head.querySelector<HTMLElement>('[data-heading-img]')
      const imgAt = imgEl ? CHAR_START + units.indexOf(imgEl) * CHAR_STAGGER : 0

      const headTl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 65%', once: true },
      })
      headTl
        .from(units, { ...SOFT_BLUR, stagger: CHAR_STAGGER }, CHAR_START)
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

      // On top of its turn in the stagger, the photo also swings up from 60% scale to full
      // size, so it reads as something that lands rather than a character that fades.
      if (imgEl) {
        headTl.from(
          imgEl,
          { scale: 0.6, rotation: -12, duration: 0.7, ease: 'back.out(1.6)' },
          imgAt,
        )
      }

      // 2. The bento panel fades and expands into place, then its four cards are dealt in one
      //    by one, top-left to bottom-right, matching the reference recording.
      const panelTl = gsap.timeline({
        scrollTrigger: { trigger: panel, start: 'top 80%', once: true },
      })
      panelTl
        .from(panel, { opacity: 0, scale: 0.94, duration: 0.6, ease: 'power1.out' })
        .from(
          panel.querySelectorAll('[data-bento-card]'),
          {
            opacity: 0,
            y: 14,
            filter: 'blur(8px)',
            duration: 0.7,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.12,
          },
          '-=0.2',
        )
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.whyNow} data-testid="why-now" ref={rootRef}>
      <div className={styles.text} ref={headRef}>
        <div className={styles.textInner}>
          <h2 className={styles.heading}>
            <div className={styles.headingLine}>
              <span>
                <AnimatedChars text={t.whyNow.headingBeforeImg} />
              </span>
              <img
                className={styles.headingImg}
                src={titleImg}
                alt=""
                data-soft-blur-char
                data-heading-img
              />
              <span>
                <AnimatedChars text={t.whyNow.headingAfterImg} />
              </span>
            </div>
            <div>
              <AnimatedChars text={t.whyNow.headingLine2} />
            </div>
          </h2>
        </div>
        <p className={styles.description}>
          <AnimatedWords text={t.whyNow.description} />
        </p>
      </div>

      <div className={styles.panel} ref={panelRef} data-testid="why-now-panel">
        <div className={styles.hero}>
          <img className={styles.heroPhoto} src={bento1} alt="" />
          <div className={styles.heroFade} />
          <p className={styles.heroLabel}>{t.whyNow.conditionsLabel}</p>
          <h3 className={styles.heroHeading}>{t.whyNow.heroHeading}</h3>
        </div>

        <div className={styles.grid}>
          <article className={styles.card} data-bento-card>
            <img className={styles.cardPhoneImg} src={bento2} alt="" />
            <p className={styles.cardLabel}>{t.whyNow.bento[0]}</p>
          </article>

          <article className={styles.card} data-bento-card>
            <img className={styles.cardCollageImg} src={bento4} alt="" />
            <p className={styles.cardLabel}>{t.whyNow.bento[1]}</p>
          </article>

          <article className={styles.card} data-bento-card>
            <img className={styles.cardNotebookImg} src={bento3} alt="" />
            <p className={styles.cardLabel}>{t.whyNow.bento[2]}</p>
          </article>

          <article className={styles.card} data-bento-card>
            <img className={styles.cardCommerceImg} src={bento5} alt="" />
            <p className={styles.cardLabel}>{t.whyNow.bento[3]}</p>
          </article>
        </div>
      </div>
    </section>
  )
}
