import styles from './About.module.css';
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t("about.title")}</h2>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutCols}>
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
          </div>
          <div className={styles.aboutCols}>
            <p>{t("about.p3")}</p>
            <p>{t("about.p3")}</p>
          </div>
        </div>
        <div className={styles.aboutImgFrame}>
          <div className={styles.aboutImgWrap}>
            <img
              src="https://perfectoservicestorage.blob.core.windows.net/img/50a8bb90-7637-406f-9195-c2c12a652d0c.png"
              alt={t("about.imgAlt")}
              className={styles.aboutImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}