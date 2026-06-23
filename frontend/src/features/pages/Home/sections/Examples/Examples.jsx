import styles from './Examples.module.css';
import { EXAMPLES } from '../../../../../data/homeData.js';
import BeforeAfterCard from './BeforeAfterCard';
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ExamplesSection() {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  const visibleExamples = showAll ? EXAMPLES : EXAMPLES.slice(0, 2);

  return (
    <section className={styles.examples}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitleDark}>{t("examples.title")}</h2>
        <p className={styles.exSubtitle}>{t("examples.subtitle")}</p>
        <div className={styles.exGrid}>
          {visibleExamples.map((ex) => (
            <BeforeAfterCard key={ex.label} example={ex} />
          ))}
        </div>
        <div className={styles.servicesBtnRow}>
          <button className={styles.btnPrimary} onClick={() => setShowAll(!showAll)}>
            {showAll ? t("examples.collapse") : t("examples.showMore")}
          </button>
        </div>
      </div>
    </section>
  );
}