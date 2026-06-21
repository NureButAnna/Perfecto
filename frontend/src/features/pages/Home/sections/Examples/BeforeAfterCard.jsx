import styles from './Examples.module.css';

export default function BeforeAfterCard({ example }) {
  return (
    <div className={styles.exCard}>
      <div className={styles.exImgRow}>
        <div className={styles.exImgWrap}>
          <img src={example.before} alt={`До — ${example.label}`} />
          <span className={styles.exBadge + " " + styles.exBadgeBefore}>ДО</span>
        </div>
        <div className={styles.exImgWrap}>
          <img src={example.after} alt={`Після — ${example.label}`} />
          <span className={styles.exBadge + " " + styles.exBadgeAfter}>ПІСЛЯ</span>
        </div>
      </div>
      <p className={styles.exLabel}>{example.label}</p>
    </div>
  );
}