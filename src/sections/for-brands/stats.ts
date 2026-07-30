import cursorIcon from '../../assets/icons/cursor-magic-selection-02.svg'
import eyeIcon from '../../assets/icons/eye.svg'
import saleTagIcon from '../../assets/icons/sale-tag-01.svg'

export type Stat = {
  icon: string
  /** CSS color for the 44px icon chip behind the icon. */
  iconBg: string
  target: number
  /** How the counted-up value is printed once it lands on `target`. */
  format: 'number' | 'currency'
  /** Positive-only, printed as "+N.N%" in the mint delta pill. */
  delta: number
}

/** Labels are translated and live in `t.forBrands.stats`, indexed by this same order. */
export const STATS: Stat[] = [
  { icon: cursorIcon, iconBg: 'var(--color-yellow)', target: 24560, format: 'number', delta: 18.6 },
  { icon: eyeIcon, iconBg: 'var(--color-blue-100)', target: 97320, format: 'number', delta: 21.4 },
  { icon: saleTagIcon, iconBg: 'var(--color-pink-100)', target: 186540, format: 'currency', delta: 24.8 },
]
