import brandImage from '../../assets/images/our-platform-brand.webp'
import creatorsImage from '../../assets/images/our-platform-creators.webp'
import platformImage from '../../assets/images/our-platform-platform.webp'

export type PlatformTab = {
  id: string
  image: string
}

/** Labels and captions are translated and live in `t.ourPlatform.tabs`, indexed by this same
 * order. */
export const PLATFORM_TABS: PlatformTab[] = [
  { id: 'brand', image: brandImage },
  { id: 'creators', image: creatorsImage },
  { id: 'platform', image: platformImage },
]
