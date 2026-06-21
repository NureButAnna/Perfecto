import styles  from './HowItWorks.module.css';
import { STEPS } from '../../../../../data/homeData.js';

export default function HowItWorksSection() {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitleLight}>Як це працює</h2>
        <div className={styles.stepsRow}>
          {STEPS.map((step, idx) => (
            <div key={step.num} className={styles.step}>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepDesc}>{step.desc}</p>
              {idx < STEPS.length - 1 && (
                <div className={styles.stepConnector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}