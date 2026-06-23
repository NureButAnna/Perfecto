import styles from './Examples.module.css';
import { useTranslation } from "react-i18next";

export default function BeforeAfterCard({ example }) {
  const { t } = useTranslation();
  return (
    <div className={styles.exCard}>
      <div className={styles.exImgRow}>
        <div className={styles.exImgWrap}>
          <img src={example.before} alt={`${t("examples.before")} — ${example.label}`} />
          <span className={styles.exBadge + " " + styles.exBadgeBefore}>{t("examples.before")}</span>
        </div>
        <div className={styles.exImgWrap}>
          <img src={example.after} alt={`${t("examples.after")} — ${example.label}`} />
          <span className={styles.exBadge + " " + styles.exBadgeAfter}>{t("examples.after")}</span>
        </div>
      </div>
      <p className={styles.exLabel}>{example.label}</p>
    </div>
  );
}