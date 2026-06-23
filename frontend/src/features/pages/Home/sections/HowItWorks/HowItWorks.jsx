import styles from './HowItWorks.module.css';
import { STEPS } from '../../../../../data/homeData.js';
import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  const { t } = useTranslation();
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitleLight}>{t("howItWorks.title")}</h2>
        <div className={styles.stepsRow}>
          {STEPS.map((step, idx) => (
            <div key={step.num} className={styles.step}>
              <div className={styles.stepNum}>{step.num}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepDesc}>{step.desc}</p>
              {idx < STEPS.length - 1 && <div className={styles.stepConnector} aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}