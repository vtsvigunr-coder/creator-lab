import join1 from '../../assets/images/why-join-1.png'
import join2 from '../../assets/images/why-join-2.png'
import join3 from '../../assets/images/why-join-3.png'
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
  caption: string
  /** Which side of the image the caption sits on, per the Figma layout. */
  captionSide: 'left' | 'right'
  captionTop: number
  icons: [JoinIcon, JoinIcon]
}

/**
 * All positions are absolute pixels within the 1440-wide canvas, taken directly from the
 * Figma frame metadata (nodes 1515:21830, 1190:24683, 1190:24698).
 */
export const JOIN_SLIDES: JoinSlide[] = [
  {
    id: 'brands',
    image: join1,
    caption: 'Brands ready to scale through creators',
    captionSide: 'left',
    captionTop: 592,
    icons: [
      { src: icon1a, top: 594, left: 860 },
      { src: icon1b, top: 661, left: 520 },
    ],
  },
  {
    id: 'creators',
    image: join2,
    caption: 'Creators building trust and long-term income',
    captionSide: 'right',
    captionTop: 562,
    icons: [
      { src: icon2a, top: 716, left: 921 },
      { src: icon2b, top: 488, left: 464 },
    ],
  },
  {
    id: 'partners',
    image: join3,
    caption: 'Partners shaping where commerce is headed',
    captionSide: 'left',
    captionTop: 567,
    icons: [
      { src: icon3a, top: 518, left: 758 },
      { src: icon3b, top: 646, left: 557 },
    ],
  },
]
