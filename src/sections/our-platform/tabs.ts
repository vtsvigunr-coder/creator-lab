import brandImage from '../../assets/images/our-platform-brand.webp'
import creatorsImage from '../../assets/images/our-platform-creators.webp'
import platformImage from '../../assets/images/our-platform-platform.webp'

export type PlatformTab = {
  id: string
  label: string
  /** Rendered as two forced lines, matching the Figma caption's manual break. */
  captionLines: [string, string]
  image: string
}

export const PLATFORM_TABS: PlatformTab[] = [
  {
    id: 'brand',
    label: 'For Brand',
    captionLines: ['Launch creator campaigns', 'and track every sale clearly.'],
    image: brandImage,
  },
  {
    id: 'creators',
    label: 'For Creators',
    captionLines: ['Share links and see', 'earnings in real time'],
    image: creatorsImage,
  },
  {
    id: 'platform',
    label: 'For the Platform',
    captionLines: ['Manage brands, creators, products', 'campaigns, and payouts centrally'],
    image: platformImage,
  },
]
