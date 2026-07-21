import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { CHAR_STAGGER, CHAR_START, SOFT_BLUR } from '../../lib/softBlurReveal'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import titleImg from '../../assets/images/why-now-title-img.webp'
import bento1 from '../../assets/images/why-now-bento-1.webp'
import bento2 from '../../assets/images/why-now-bento-2.webp'
import bento3 from '../../assets/images/why-now-bento-3.webp'
import bento4a from '../../assets/images/why-now-bento-4-1.svg'
import bento4b from '../../assets/images/why-now-bento-4-2.svg'
import bento5 from '../../assets/images/why-now-bento-5.webp'
import unlinkIcon from '../../assets/icons/unlink-03.svg'
import contentIsKing from '../../assets/icons/content-is-king.svg'
import messageMultiple from '../../assets/icons/message-multiple-02.svg'
import styles from './WhyNow.module.css'

const HEADING_BEFORE_IMG = 'Built for'
const HEADING_AFTER_IMG = 'the reality'
const HEADING_LINE_2 = 'of Uzbekistan'
const DESCRIPTION = "Creator Lab is designed for the local market, not copied from someone else's playbook"

export default function WhyNow() {
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
                <AnimatedChars text={HEADING_BEFORE_IMG} />
              </span>
              <img
                className={styles.headingImg}
                src={titleImg}
                alt=""
                data-soft-blur-char
                data-heading-img
              />
              <span>
                <AnimatedChars text={HEADING_AFTER_IMG} />
              </span>
            </div>
            <div>
              <AnimatedChars text={HEADING_LINE_2} />
            </div>
          </h2>
        </div>
        <p className={styles.description}>
          <AnimatedWords text={DESCRIPTION} />
        </p>
      </div>

      <div className={styles.panel} ref={panelRef} data-testid="why-now-panel">
        <div className={styles.hero}>
          <img className={styles.heroPhoto} src={bento1} alt="" />
          <div className={styles.heroFade} />
          <p className={styles.heroLabel}>We understand the real operating conditions:</p>
          <h3 className={styles.heroHeading}>Social-first product discovery</h3>
        </div>

        <div className={styles.grid}>
          <article className={styles.card} data-bento-card>
            <img className={styles.cardPhoneImg} src={bento2} alt="" />
            <img className={styles.stickerKing} src={contentIsKing} alt="" />
            <img className={styles.stickerMessage} src={messageMultiple} alt="" />
            <p className={styles.cardLabel}>DM-based selling habits</p>
          </article>

          <article className={styles.card} data-bento-card>
            <div className={styles.cardCollage}>
              <img className={styles.collagePhotoA} src={bento4a} alt="" />
              <img className={styles.collagePhotoB} src={bento4b} alt="" />
              <span className={styles.pillCreator}>Creator</span>
              <span className={styles.pillBrand}>Brand</span>
              <span className={styles.unlinkBadge}>
                <img src={unlinkIcon} alt="" className={styles.unlinkIcon} />
              </span>
            </div>
            <p className={styles.cardLabel}>Fragmented creator-brand relationships</p>
          </article>

          <article className={styles.card} data-bento-card>
            <img className={styles.cardNotebookImg} src={bento3} alt="" />
            <p className={styles.cardLabel}>Weak tracking and informal reporting</p>
          </article>

          <article className={styles.card} data-bento-card>
            <img className={styles.cardCommerceImg} src={bento5} alt="" />
            <p className={styles.cardLabel}>Demand for better commerce systems</p>
          </article>
        </div>
      </div>
    </section>
  )
}
