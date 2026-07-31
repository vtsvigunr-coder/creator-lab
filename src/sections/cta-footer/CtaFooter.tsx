import CircleRevealButton from '../hero/CircleRevealButton'
import ctaBg from '../../assets/images/cta-section.webp'
import ctaBgMobile from '../../assets/images/cta-section-mobile.webp'
import basketIcon from '../../assets/icons/shopping-basket-favorite-03.svg'
import videoIcon from '../../assets/icons/computer-video.svg'
import { LEGAL_LINKS, NAV_LINKS, SOCIAL_ICONS, scrollToSection } from '../../lib/siteLinks'
import { useTranslation } from '../../i18n/LanguageContext'
import styles from './CtaFooter.module.css'

// A plain static section — no scroll-jack, no pin, no JS-computed shape. Just a flat photo
// full-bleed behind the copy.
export default function CtaFooter() {
  const { t } = useTranslation()

  return (
    <section className={styles.ctaFooter} data-testid="cta-footer">
      <div className={styles.photo} data-testid="cta-photo">
        <picture>
          {/* Matches the stylesheet's own `max-width: 900px` breakpoint. */}
          <source media="(max-width: 900px)" srcSet={ctaBgMobile} />
          <img className={styles.photoImage} src={ctaBg} alt="" />
        </picture>
      </div>

      <div className={styles.content}>
        <div className={styles.center}>
          <div className={styles.textBlock}>
            <h2 className={styles.heading}>
              {t.ctaFooter.headingLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </h2>
            <p className={styles.description}>{t.ctaFooter.description}</p>
          </div>

          <div className={styles.buttons}>
            <CircleRevealButton label={t.ctaFooter.applyAsBrand} icon={basketIcon} variant="light" fluid />
            <CircleRevealButton
              label={t.ctaFooter.applyAsCreator}
              icon={videoIcon}
              variant="outlineLight"
              fluid
            />
          </div>
        </div>

        {/* Groups the footer bar with the (mobile-only) legal row, so `.content` only ever
            has two children — `.center` and this — for `justify-content: space-between` to
            push apart on mobile. Desktop instead pins this to the bottom via margin-top: auto,
            with the legal row hidden (see the stylesheet). */}
        <div className={styles.footerLinks}>
          <div className={styles.footerBar}>
            <p className={styles.copyright}>{t.ctaFooter.copyright}</p>

            <nav className={styles.navGlass} aria-label="Footer">
              <span className={styles.navGlassFill} />
              <ul className={styles.navList}>
                {NAV_LINKS.map((link) => (
                  <li key={link.key}>
                    <button
                      type="button"
                      className={styles.navLink}
                      onClick={() => scrollToSection(link.targetTestId)}
                    >
                      {t.nav.sitemap[link.key]}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.social}>
              {SOCIAL_ICONS.map((item) => (
                <img key={item.label} className={styles.socialIcon} src={item.icon} alt={item.label} />
              ))}
            </div>
          </div>

          {/* Desktop's Figma frame (node 1203:15997) has no legal row at all — only the
              mobile one (node 2312:20343) does; see the `max-width: 900px` block below. */}
          <ul className={styles.legalRow}>
            {t.nav.legal.map((label, i) => (
              <li key={label} className={styles.legalItem}>
                {i > 0 && <span className={styles.legalDot} aria-hidden="true" />}
                <a className={styles.legalLink} href={LEGAL_LINKS[i] ?? '#'}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
