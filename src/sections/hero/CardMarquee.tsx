import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { buildLoopList } from '../../lib/buildLoopList'
import styles from './CardMarquee.module.css'

import img0 from '../../assets/images/Img.webp'
import img1 from '../../assets/images/Img-1.webp'
import img2 from '../../assets/images/Img-2.webp'
import img3 from '../../assets/images/Img-3.webp'
import img4 from '../../assets/images/Img-4.webp'
import dyson from '../../assets/images/Dyson.svg'
import xlash from '../../assets/images/xlash.png'
import weekday from '../../assets/images/weekday.png'

type Card = { type: 'photo' | 'logo'; src: string; bg?: string; width: number; height: number }

// Exact per-card sizes from Figma (node 1190-23928) — the row is not a uniform grid.
const CARDS: Card[] = [
  { type: 'photo', src: img0, width: 153.525, height: 102.878 },
  { type: 'logo', src: dyson, bg: 'var(--color-mint-100)', width: 197, height: 220 },
  { type: 'photo', src: img1, width: 153, height: 174 },
  { type: 'photo', src: img2, width: 153, height: 102 },
  { type: 'logo', src: xlash, bg: 'var(--color-violet-200)', width: 153, height: 162 },
  { type: 'photo', src: img3, width: 189, height: 220 },
  { type: 'logo', src: weekday, bg: 'var(--color-blue-200)', width: 153, height: 162 },
  { type: 'photo', src: img4, width: 189, height: 220 },
]

type CardMarqueeProps = {
  onComplete?: () => void
}

export default function CardMarquee({ onComplete }: CardMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const loopCards = buildLoopList(CARDS)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const allCards = track.querySelectorAll('[data-card]')
    const half = Array.from(allCards).slice(0, CARDS.length)

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.()
        const loopWidth = track.scrollWidth / 2
        gsap.to(track, {
          x: -loopWidth,
          duration: 24,
          ease: 'none',
          repeat: -1,
        })
      },
    })

    tl.from(half, {
      opacity: 0,
      filter: 'blur(10px)',
      x: -24,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div className={styles.viewport} data-testid="card-marquee">
      <div className={styles.track} ref={trackRef}>
        {loopCards.map((card, i) =>
          card.type === 'photo' ? (
            <img
              key={i}
              src={card.src}
              className={styles.card}
              style={{ width: card.width, height: card.height }}
              data-card
              alt=""
            />
          ) : (
            <div
              key={i}
              className={styles.logoCard}
              style={{ background: card.bg, width: card.width, height: card.height }}
              data-card
            >
              <img src={card.src} alt="" style={{ width: '60%' }} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}
