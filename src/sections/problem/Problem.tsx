import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { AnimatedChars, AnimatedWords } from '../../components/AnimatedText'
import WipeRevealTag from '../../components/WipeRevealTag'
import { clampApexRadius, peakedEdgeClipPath } from '../../lib/peakedEdgeClipPath'
import { useTranslation } from '../../i18n/LanguageContext'
import problemImage from '../../assets/images/problem.webp'
import styles from './Problem.module.css'

// Where inside the 300vh scroll the curtain travels. Before it the intro copy sits alone on
// white; after it the photo is full-bleed and the outro copy plays.
const CURTAIN_START = 0.2
const CURTAIN_END = 0.75
// Peak height of the centre pull, as a fraction of the stage height. The curtain is already
// pointed on its very first frame — it's being pulled up by the middle — and only flattens
// out at the end, so it lands as a straight edge covering the whole viewport.
const PEAK = 0.18
// Corner radius of the apex, in px of horizontal run: the point is blunted with a curve
// tangent to both slopes rather than meeting at a hard vertex.
const APEX_RADIUS = 90
// How much faster the outro rewinds than it played in.
const REVERSE_SPEED = 3
// Top of the mask at a given progress — the apex of the peak, i.e. the highest point the
// photo has to reach. The image is pinned to exactly this, so it is dragged up out of the
// bottom of the screen with the curtain and its own top edge is never inside the cut-out.
function curtainApexY(p: number, h: number) {
  const amp = PEAK * h * (1 - p * p)
  return (h + amp) * (1 - p) - amp
}

function curtainClip(p: number, w: number, h: number) {
  // Full amplitude while the curtain travels, easing to nothing as it seals the top.
  const amp = PEAK * h * (1 - p * p)
  // The whole shape is pushed down by its own peak height, so at p = 0 even the apex sits on
  // the bottom edge and nothing shows: the curtain enters from off-screen, point first.
  const sideY = (h + amp) * (1 - p)
  const half = w / 2
  const r = clampApexRadius(w, APEX_RADIUS)
  // Where the straight slopes stop and the apex curve takes over.
  const shoulderY = sideY - amp * (1 - r / half)
  const peakY = sideY - amp
  return peakedEdgeClipPath(w, h, sideY, peakY, shoulderY, r)
}

export default function Problem() {
  const { t } = useTranslation()
  const rootRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)
  const glassFillRef = useRef<HTMLSpanElement>(null)
  const footnoteRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const intro = introRef.current
    const curtain = curtainRef.current
    const outro = outroRef.current
    const glassFill = glassFillRef.current
    const footnote = footnoteRef.current
    if (!root || !intro || !curtain || !outro || !glassFill || !footnote) return

    const ctx = gsap.context(() => {
      // 1. Intro copy — same soft-blur reveal as the hero, fired once when the section
      //    scrolls into view, with the tag wiping open ahead of the heading.
      const introTl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 65%', once: true },
      })
      introTl
        .from(intro.querySelectorAll('[data-wipe-tag]'), {
          width: 0,
          paddingLeft: 0,
          paddingRight: 0,
          duration: 0.55,
          ease: 'sine.inOut',
        })
        .from(
          intro.querySelectorAll('[data-soft-blur-char]'),
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
          intro.querySelectorAll('[data-desc-word]'),
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

      // 2. The outro plays the moment the curtain has filled the screen — and rewinds if the
      //    curtain is pulled back down.
      const outroChars = outro.querySelectorAll('[data-soft-blur-char]')
      const outroStagger = 0.025
      const outroCharDuration = 0.9

      // The glass plate should start wiping open once "fragmented."'s own characters have
      // finished revealing, not the whole heading — same gesture as the hero's Uzbekistan
      // marker, derived from that word's own last character landing.
      const fragmentedChars = glassFill.parentElement!.querySelectorAll('[data-soft-blur-char]')
      const glassStart =
        Array.from(outroChars).indexOf(fragmentedChars[fragmentedChars.length - 1]) *
          outroStagger +
        outroCharDuration

      const outroTl = gsap.timeline({ paused: true })
      outroTl
        .to(outro, { opacity: 1, duration: 0.01 })
        .from(
          outroChars,
          {
            opacity: 0,
            y: 16,
            filter: 'blur(12px)',
            duration: outroCharDuration,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: outroStagger,
          },
          0,
        )
        .from(
          outro.querySelectorAll('[data-desc-word]'),
          {
            opacity: 0,
            y: 10,
            filter: 'blur(8px)',
            duration: 0.6,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            stagger: 0.03,
          },
          0,
        )
        .addLabel('copyDone')
        // Same gesture as the hero's Uzbekistan marker, but a pane rather than a solid fill.
        .to(glassFill, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, glassStart)
        // Only once the copy has fully landed does the footnote appear, same as before.
        .to(footnote, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 'copyDone')

      // 3. The curtain itself is scrubbed: it tracks the scroll position directly, so it
      //    reads as a blind being pulled up by hand rather than a canned animation.
      // The path is in px, so it has to be rebuilt against the live stage size.
      const image = curtain.querySelector('img') as HTMLImageElement
      const draw = (p: number) => {
        const { width, height } = curtain.getBoundingClientRect()
        curtain.style.clipPath = curtainClip(p, width, height)
        image.style.transform = `translateY(${(curtainApexY(p, height) / height) * 100}%)`
      }
      draw(0)
      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onRefresh: (self) =>
          draw(
            gsap.utils.clamp(
              0,
              1,
              (self.progress - CURTAIN_START) / (CURTAIN_END - CURTAIN_START),
            ),
          ),
        onUpdate: (self) => {
          const p = gsap.utils.clamp(
            0,
            1,
            (self.progress - CURTAIN_START) / (CURTAIN_END - CURTAIN_START),
          )
          draw(p)
          // Reversible on purpose: scrolling back up rewinds the outro copy and its glass
          // plate rather than leaving them stranded over the photo. The rewind runs faster
          // than the entrance so the copy is already gone by the time the photo has visibly
          // started to collapse.
          if (p >= 1) outroTl.timeScale(1).play()
          else outroTl.timeScale(REVERSE_SPEED).reverse()
        },
      })
    }, root)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className={styles.problem} data-testid="problem" ref={rootRef}>
      <div className={styles.stage}>
        <div className={`${styles.block} ${styles.intro}`} ref={introRef}>
          <div className={styles.introHead}>
            <WipeRevealTag label={t.problem.tag} />
            <h2 className={styles.heading}>
              <div>
                <AnimatedChars text={t.problem.introLine1} />
              </div>
              <div>
                <AnimatedChars text={t.problem.introLine2} />
              </div>
            </h2>
          </div>
          <p className={styles.description}>
            <AnimatedWords text={t.problem.introDescription} />
          </p>
        </div>

        <div className={styles.curtain} ref={curtainRef} data-testid="problem-curtain">
          <img className={styles.curtainImage} src={problemImage} alt="" />
          <div className={styles.scrim} />
        </div>

        <div className={`${styles.block} ${styles.outro}`} ref={outroRef}>
          <div className={styles.outroHead}>
            <h2 className={styles.heading}>
              <div>
                <AnimatedChars text={t.problem.outroLine1} />
              </div>
              <div className={styles.glassRow}>
                <span>
                  <AnimatedChars text={t.problem.outroIsStill} />
                </span>
                <span className={styles.glassBox} data-testid="fragmented-plate">
                  <span className={styles.glassFill} ref={glassFillRef} />
                  <span className={styles.glassText}>
                    <AnimatedChars text={t.problem.outroFragmented} />
                  </span>
                </span>
              </div>
            </h2>
          </div>
          <p className={styles.description}>
            <AnimatedWords text={t.problem.outroDescription} />
          </p>
        </div>

        <p className={styles.footnote} ref={footnoteRef}>
          {t.problem.footnote}
        </p>
      </div>
    </section>
  )
}
