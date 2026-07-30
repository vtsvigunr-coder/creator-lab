import storeAddIcon from '../../assets/icons/store-add-01.svg'
import promotionIcon from '../../assets/icons/promotion.svg'
import basketSecureIcon from '../../assets/icons/shopping-basket-secure-03.svg'
import transactionIcon from '../../assets/icons/transaction.svg'

export type Step = {
  icon: string
  /** Resting tilt in degrees. GSAP owns it, so it is data rather than CSS. */
  rotation: number
  /** Left offset inside the 1160px card strip. */
  left: number
}

/** Title, description, and badge are translated and live in `t.howItWorks.steps`, indexed by
 * this same order. */
export const STEPS: Step[] = [
  { icon: storeAddIcon, rotation: -8.05, left: 0 },
  { icon: promotionIcon, rotation: 7.56, left: 305 },
  { icon: basketSecureIcon, rotation: -2.68, left: 590 },
  { icon: transactionIcon, rotation: 4.09, left: 875 },
]
