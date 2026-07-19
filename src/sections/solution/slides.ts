import brands from '../../assets/images/solution-brands.webp'
import creators from '../../assets/images/solution-creators.webp'
import platform from '../../assets/images/solution-platform.webp'

export type Slide = {
  id: string
  label: string
  image: string
  caption: string
}

/** Order matters: the two side circles are simply the previous and next entries. */
export const SLIDES: Slide[] = [
  {
    id: 'brands',
    label: 'For brands',
    image: brands,
    caption:
      'List products, activate creators, track performance, and centralize creator-driven sales.',
  },
  {
    id: 'creators',
    label: 'For creators',
    image: creators,
    caption:
      'Monetize influence through trusted products, performance visibility, and structured payouts',
  },
  {
    id: 'platform',
    label: 'For the platform',
    image: platform,
    caption:
      'Track attribution, manage billing, handle payout logic, and create a cleaner economic system for both sides',
  },
]
