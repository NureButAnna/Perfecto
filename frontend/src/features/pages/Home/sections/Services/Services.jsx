import styles  from './Services.module.css';
import { SERVICES } from '../../../../../data/homeData.js';

export default function ServicesSection() {
  return (
    <section className={styles.services}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitleDark}>Популярні послуги</h2>
        <div className={styles.servicesGrid}>
          {SERVICES.map((svc) => (
            <div key={svc.label} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>{svc.icon}</span>
              <span className={styles.serviceLabel}>{svc.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}