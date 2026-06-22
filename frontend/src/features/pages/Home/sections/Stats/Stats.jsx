import styles  from './Stats.module.css';
import { STATS } from '../../../../../data/homeData.js';

export default function StatsSection() {
  return (
    <section className={styles.stats}>
      <div className={styles.statsInner}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}