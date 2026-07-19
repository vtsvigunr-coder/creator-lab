import styles from './WipeRevealTag.module.css'

/**
 * Presentational only: the reveal (a left-to-right width wipe that uncovers the label as the
 * plate grows) is driven by the section timeline via the `data-wipe-tag` hook, so it stays in
 * step with the heading and description around it.
 */
export default function WipeRevealTag({ label }: { label: string }) {
  return (
    <span className={styles.tag} data-wipe-tag data-testid="problem-tag">
      <span className={styles.label}>{label}</span>
    </span>
  )
}
