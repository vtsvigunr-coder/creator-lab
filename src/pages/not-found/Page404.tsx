import Header from '../../sections/hero/Header'
import CircleRevealButton from '../../sections/hero/CircleRevealButton'
import notFoundPhoto from '../../assets/images/404-hero.webp'
import styles from './Page404.module.css'

export default function Page404() {
  return (
    <div className={styles.page} data-testid="page-404">
      <div className={styles.photo} aria-hidden="true">
        <img className={styles.photoImage} src={notFoundPhoto} alt="" />
        <div className={styles.overlay} />
      </div>

      <div className={styles.headerLayer}>
        <Header variant="light" />
      </div>

      <div className={styles.content}>
        <p className={styles.code}>404</p>
        <p className={styles.subtitle}>Ooops... We Couldn&rsquo;t Find That Page</p>
        <CircleRevealButton label="Back to Home Page" variant="light" onClick={() => (window.location.href = '/')} />
      </div>
    </div>
  )
}
