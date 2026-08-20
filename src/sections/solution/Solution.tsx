import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import CircleRevealButton from '../hero/CircleRevealButton'
import SolutionSlider from './SolutionSlider'
import { useIsMobile } from '../../lib/useIsMobile'
import { useTranslation } from '../../i18n/LanguageContext'
import arrowIcon from '../../assets/icons/arrow-right-02-sharp.svg'
import styles from './Solution.module.css'

export default function Solution() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const rootRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const head = headRef.current
    if (!root || !head) return

    const ctx = gsap.context(() => {
      // Same entrance as the other sections: the tag wipes open, then the heading resolves
      // character by character with the description close behind.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 65%', once: true },
      })
      tl.from(head.querySelectorAll('[data-wipe-tag]'), {
        width: 0,
        paddingLeft: 0,
        paddingRight: 0,
        duration: 0.55,
        ease: 'sine.inOut',
      })
        .from(
          head.querySelectorAll('[data-soft-blur-char]'),
          {
            opacity: 0,
            y: 16,
            filter: 'blur(12px)',
            duration: 0.9,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.025,
          },
          0.25,
        )
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
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.solution} data-testid="solution" ref={rootRef}>
      <div className={styles.head} ref={headRef}>
        <div className={styles.copy}>
          <div className={styles.tagAndHeading}>
            <WipeRevealTag label={t.solution.tag} />
            <h2 className={styles.heading}>
              {(isMobile && t.solution.headingLinesMobile
                ? t.solution.headingLinesMobile
                : [t.solution.headingLine1, t.solution.headingLine2]
              ).map((line) => (
                <div key={line}>
                  <AnimatedChars text={line} />
                </div>
              ))}
            </h2>
          </div>
          <p className={styles.description}>
            <AnimatedWords text={t.solution.description} />
          </p>
        </div>
        {/* Same circle-to-pill reveal as the hero buttons, held until the section scrolls in. */}
        <CircleRevealButton
          label={t.solution.cta}
          icon={arrowIcon}
          iconPosition="end"
          variant="solid"
          startOnScroll
        />
      </div>
      <SolutionSlider />
    </section>
  )
}
