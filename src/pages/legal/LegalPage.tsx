import { useEffect, useRef, useState, type ReactNode } from 'react'
import Header from '../../sections/hero/Header'
import CtaFooter from '../../sections/cta-footer/CtaFooter'
import { useLenis } from '../../lib/useLenis'
import styles from './LegalPage.module.css'

export type LegalSection = {
  id: string
  label: string
}

type LegalPageProps = {
  title: string
  lastUpdated: string
  sections: LegalSection[]
  children: ReactNode
}

export default function LegalPage({ title, lastUpdated, sections, children }: LegalPageProps) {
  useLenis()

  const [activeId, setActiveId] = useState(sections[0]?.id)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const headings = sections
      .map((section) => content.querySelector<HTMLElement>(`#${CSS.escape(section.id)}`))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    )
    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.root} data-testid="legal-page">
      <Header />

      <div className={styles.hero}>
        <div className={styles.textBlock}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>Last updated: {lastUpdated}</p>
        </div>

        <div className={styles.layout}>
          <nav className={styles.toc} aria-label="Table of contents">
            <ul className={styles.tocList}>
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    className={`${styles.tocLink} ${activeId === section.id ? styles.tocLinkActive : ''}`}
                    onClick={() => goToSection(section.id)}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div ref={contentRef} className={styles.content}>
            {children}
          </div>
        </div>
      </div>

      <CtaFooter />
    </div>
  )
}
