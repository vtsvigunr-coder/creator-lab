import join1 from '../../assets/images/why-join-1.webp'
import join2 from '../../assets/images/why-join-2.webp'
import join3 from '../../assets/images/why-join-3.webp'
import icon1a from '../../assets/icons/why-join-icon-1.svg'
import icon1b from '../../assets/icons/why-join-icon-1-2.svg'
import icon2a from '../../assets/icons/why-join-icon-2.svg'
import icon2b from '../../assets/icons/why-join-icon-2-2.svg'
import icon3a from '../../assets/icons/why-join-icon-3.svg'
import icon3b from '../../assets/icons/why-join-icon-3-2.svg'

export type JoinIcon = {
  src: string
  top: number
  left: number
}

export type JoinSlide = {
  id: string
  image: string
  /** Which side of the image the caption sits on, per the Figma layout. */
  captionSide: 'left' | 'right'
  captionTop: number
  icons: [JoinIcon, JoinIcon]
  /** Icon positions for the mobile "Trust block" frame — image box there is 361x341. */
  mobileIcons: [JoinIcon, JoinIcon]
}

/**
 * All positions are absolute pixels within the 1440-wide canvas, taken directly from the
 * Figma frame metadata (nodes 1515:21830, 1190:24683, 1190:24698). Captions are translated and
 * live in `t.whyCreatorsJoin.slides`, indexed by this same order.
 */
export const JOIN_SLIDES: JoinSlide[] = [
  {
    id: 'brands',
    image: join1,
    captionSide: 'left',
    captionTop: 592,
    icons: [
      { src: icon1a, top: 594, left: 860 },
      { src: icon1b, top: 661, left: 520 },
    ],
    mobileIcons: [
      { src: icon1a, top: 159.586, left: 280 },
      { src: icon1b, top: 223.586, left: 42 },
    ],
  },
  {
    id: 'creators',
    image: join2,
    captionSide: 'right',
    captionTop: 562,
    icons: [
      { src: icon2a, top: 716, left: 921 },
      { src: icon2b, top: 488, left: 464 },
    ],
    mobileIcons: [
      { src: icon2a, top: 237.098, left: 311 },
      { src: icon2b, top: 93.098, left: 9 },
    ],
  },
  {
    id: 'partners',
    image: join3,
    captionSide: 'left',
    captionTop: 567,
    icons: [
      { src: icon3a, top: 518, left: 758 },
      { src: icon3b, top: 646, left: 557 },
    ],
    mobileIcons: [
      { src: icon3a, top: 111.098, left: 213 },
      { src: icon3b, top: 221.098, left: 79 },
    ],
  },
]
