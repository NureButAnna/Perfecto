import styles   from './About.module.css';

export default function About() {
   return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Про нас</h2>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutCols}>
            <p>
              Ми працюємо у сфері хімчистки вже більше 20 років, постійно
              вдосконалюємо свої технології та рецептури.
            </p>
            <p>
              Наш досвід дозволяє ефективно справлятися з найскладнішими
              забрудненнями, зберігаючи структуру та колір тканин.
            </p>
          </div>
          <div className={styles.aboutCols}>
            <p>
              У роботі використовуємо сучасне обладнання та безпечні
              засоби, що гарантують якість результату.
            </p>
            <p>
              У роботі використовуємо сучасне обладнання та безпечні
              засоби, що гарантують якість результату.
            </p>
          </div>
        </div>
        <div className={styles.aboutImgFrame}>
        <div className={styles.aboutImgWrap}>
          <img
            src="https://perfectoservicestorage.blob.core.windows.net/img/50a8bb90-7637-406f-9195-c2c12a652d0c.png"
            alt="Команда Perfecto"
            className={styles.aboutImg}
          />
        </div>
        </div>
      </div>
    </section>
  );
}