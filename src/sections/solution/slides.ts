import brands from '../../assets/images/solution-brands.webp'
import creators from '../../assets/images/solution-creators.webp'
import platform from '../../assets/images/solution-platform.webp'

export type Slide = {
  id: string
  image: string
}

/** Order matters: the two side circles are simply the previous and next entries. Labels and
 * captions are translated and live in `t.solution.slides`, indexed by this same order. */
export const SLIDES: Slide[] = [
  { id: 'brands', image: brands },
  { id: 'creators', image: creators },
  { id: 'platform', image: platform },
]
