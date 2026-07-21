import instagramIcon from '../assets/icons/instagram.svg'
import linkedinIcon from '../assets/icons/linkedin.svg'
import xIcon from '../assets/icons/x.svg'
import telegramIcon from '../assets/icons/telegram.svg'

export type NavLink = {
  label: string
  /** Section to scroll to. Omitted for pages that do not exist yet, which renders the link inert. */
  targetTestId?: string
}

/** The sitemap, shared by the header menu and the footer so the two can never drift apart. */
export const NAV_LINKS: NavLink[] = [
  { label: 'How It Works', targetTestId: 'how-it-works' },
  { label: 'For Brands', targetTestId: 'for-brands' },
  { label: 'For Creators', targetTestId: 'for-creators' },
  { label: 'FAQ', targetTestId: 'faq' },
]

export const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Policy']

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
