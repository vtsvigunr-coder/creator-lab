import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { buildLoopList } from '../../lib/buildLoopList'
import styles from './CardMarquee.module.css'

import img0 from '../../assets/images/Img.png'
import img1 from '../../assets/images/Img-1.png'
import img2 from '../../assets/images/Img-2.png'
import img3 from '../../assets/images/Img-3.png'
import img4 from '../../assets/images/Img-4.png'
import dyson from '../../assets/images/Dyson.svg'
import xlash from '../../assets/images/xlash.png'
import weekday from '../../assets/images/weekday.png'

type Card = { type: 'photo' | 'logo'; src: string; bg?: string }

const CARDS: Card[] = [
  { type: 'photo', src: img0 },
  { type: 'logo', src: dyson, bg: 'var(--color-mint-100)' },
  { type: 'photo', src: img1 },
  { type: 'photo', src: img2 },
  { type: 'logo', src: xlash, bg: 'var(--color-violet-200)' },
  { type: 'photo', src: img3 },
  { type: 'logo', src: weekday, bg: 'var(--color-blue-200)' },
  { type: 'photo', src: img4 },
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
            <img key={i} src={card.src} className={styles.card} data-card alt="" />
          ) : (
            <div key={i} className={styles.logoCard} style={{ background: card.bg }} data-card>
              <img src={card.src} alt="" style={{ width: '60%' }} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}
