import styles from './Examples.module.css';
import { EXAMPLES } from '../../../../../data/homeData.js';
import BeforeAfterCard from './BeforeAfterCard'
import { useState } from "react";

export default function ExamplesSection() {
  const [showAll, setShowAll] = useState(false);

  const visibleExamples = showAll ? EXAMPLES : EXAMPLES.slice(0, 2);

  return (
    <section className={styles.examples}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitleDark}>Приклади робіт</h2>
        <p className={styles.exSubtitle}>
          Результати, які говорять самі за себе.
        </p>

        <div className={styles.exGrid}>
          {visibleExamples.map((ex) => (
            <BeforeAfterCard key={ex.label} example={ex} />
          ))}
        </div>

        <div className={styles.servicesBtnRow}>
          <button
            className={styles.btnPrimary}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Згорнути ↑" : "Більше робіт ↓"}
          </button>
        </div>
      </div>
    </section>
  );
}