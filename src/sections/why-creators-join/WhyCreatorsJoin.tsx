import { useRef } from 'react'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import { JOIN_SLIDES } from './slides'
import styles from './WhyCreatorsJoin.module.css'

const HEADING_LINE_1 = 'Not for everyone.'
const HEADING_LINE_2 = 'For serious players.'
const DESCRIPTION =
  "Creator Lab is built for brands that want real sales, and creators who want long-term value. We are building a curated ecosystem for:"

export default function WhyCreatorsJoin() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  return (
    <section className={styles.whyCreatorsJoin} data-testid="why-creators-join" ref={rootRef}>
      <div className={styles.stage}>
        <div className={styles.canvas} ref={canvasRef}>
          <div className={styles.head}>
            <div className={styles.headGroup}>
              <WipeRevealTag label="Why creators join" />
              <h2 className={styles.heading}>
                <div>
                  <AnimatedChars text={HEADING_LINE_1} />
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

          <div className={styles.slides}>
            {JOIN_SLIDES.map((slide) => (
              <div key={slide.id} className={styles.layer} data-join-layer data-join-id={slide.id}>
                <img className={styles.image} src={slide.image} alt="" data-join-image />
                <p
                  className={`${styles.caption} ${
                    slide.captionSide === 'left' ? styles.captionLeft : styles.captionRight
                  }`}
                  style={{ top: slide.captionTop }}
                  data-join-caption
                >
                  {slide.caption}
                </p>
                {slide.icons.map((icon, i) => (
                  <img
                    key={i}
                    className={styles.icon}
                    src={icon.src}
                    alt=""
                    style={{ top: icon.top, left: icon.left }}
                    data-join-icon
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
