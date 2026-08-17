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

/** `href` is omitted for the accounts that don't exist yet — those render as inert icons. */
export const SOCIAL_ICONS: { label: string; icon: string; href?: string }[] = [
  { label: 'Instagram', icon: instagramIcon, href: 'https://www.instagram.com/creatorlab_manager/' },
  { label: 'LinkedIn', icon: linkedinIcon },
  { label: 'X', icon: xIcon },
  { label: 'Telegram', icon: telegramIcon },
]

export function scrollToSection(testId?: string) {
  if (!testId) return
  document.querySelector(`[data-testid="${testId}"]`)?.scrollIntoView({ behavior: 'smooth' })
}
