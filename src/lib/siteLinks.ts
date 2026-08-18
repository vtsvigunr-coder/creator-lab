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

/** Hrefs for `t.nav.legal`, matched by index. `undefined` renders the item as inert text —
    used for pages (like Cookie Policy) that don't exist yet. */
export const LEGAL_LINKS: (string | undefined)[] = ['/privacy-policy.html', '/terms-of-service.html', undefined]

/** Each icon points at the network itself, not at a Creator Lab account — swap in the real
    profile URLs here once those accounts exist. `href` may be omitted to render an inert icon. */
export const SOCIAL_ICONS: { label: string; icon: string; href?: string }[] = [
  { label: 'Instagram', icon: instagramIcon, href: 'https://www.instagram.com/' },
  { label: 'LinkedIn', icon: linkedinIcon, href: 'https://www.linkedin.com/' },
  { label: 'X', icon: xIcon, href: 'https://x.com/' },
  { label: 'Telegram', icon: telegramIcon, href: 'https://telegram.org/' },
]

export function scrollToSection(testId?: string) {
  if (!testId) return
  document.querySelector(`[data-testid="${testId}"]`)?.scrollIntoView({ behavior: 'smooth' })
}
