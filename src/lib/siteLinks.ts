import instagramIcon from '../assets/icons/instagram.svg'
import linkedinIcon from '../assets/icons/linkedin.svg'
import xIcon from '../assets/icons/x.svg'
import telegramIcon from '../assets/icons/telegram.svg'

export type NavLink = {
  /** Key into `t.nav.sitemap` — labels are translated, so only the key is stored here. */
  key: 'howItWorks' | 'forBrands' | 'forCreators' | 'faq'
  /** Section to scroll to. Omitted for pages that do not exist yet, which renders the link inert. */
  targetTestId?: string
}

/** The sitemap, shared by the header menu and the footer so the two can never drift apart. */
export const NAV_LINKS: NavLink[] = [
  { key: 'howItWorks', targetTestId: 'how-it-works' },
  { key: 'forBrands', targetTestId: 'for-brands' },
  { key: 'forCreators', targetTestId: 'for-creators' },
  { key: 'faq', targetTestId: 'faq' },
]

export const SOCIAL_ICONS = [
  { label: 'Instagram', icon: instagramIcon },
  { label: 'LinkedIn', icon: linkedinIcon },
  { label: 'X', icon: xIcon },
  { label: 'Telegram', icon: telegramIcon },
]

export function scrollToSection(testId?: string) {
  if (!testId) return
  document.querySelector(`[data-testid="${testId}"]`)?.scrollIntoView({ behavior: 'smooth' })
}
