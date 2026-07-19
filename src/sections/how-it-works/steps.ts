import storeAddIcon from '../../assets/icons/store-add-01.svg'
import promotionIcon from '../../assets/icons/promotion.svg'
import basketSecureIcon from '../../assets/icons/shopping-basket-secure-03.svg'
import transactionIcon from '../../assets/icons/transaction.svg'

export type Step = {
  icon: string
  /** Two lines, as they are set in the design — the break is deliberate, not a wrap. */
  title: [string, string]
  description: string
  badge: string
  /** Resting tilt in degrees. GSAP owns it, so it is data rather than CSS. */
  rotation: number
  /** Left offset inside the 1160px card strip. */
  left: number
}

export const STEPS: Step[] = [
  {
    icon: storeAddIcon,
    title: ['Brands', 'join'],
    description: 'Brands onboard products and prepare campaigns through Creator Lab',
    badge: 'step 1',
    rotation: -8.05,
    left: 0,
  },
  {
    icon: promotionIcon,
    title: ['Creators', 'promote'],
    description: 'Creators receive access to products, campaigns, and trackable links.',
    badge: 'step 2',
    rotation: 7.56,
    left: 305,
  },
  {
    icon: basketSecureIcon,
    title: ['Customers', 'discover and buy'],
    description:
      'Customers move from creator content to product pages, traffic flows, and purchases',
    badge: 'step 3',
    rotation: -2.68,
    left: 590,
  },
  {
    icon: transactionIcon,
    title: ['Creator Lab', 'manages the system'],
    description:
      'Attribution, billing, payout, and performance are managed through a shared infrastructure',
    badge: 'step 4',
    rotation: 4.09,
    left: 875,
  },
]
