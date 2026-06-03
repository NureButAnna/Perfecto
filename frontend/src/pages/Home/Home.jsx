import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.badge}>Працюємо з 1998 року</span>

          <h1 className={styles.title}>
            Чистота без зайвих турбот -
            <span> якісно, швидко, зручно.</span>
          </h1>

          <p className={styles.subtitle}>
            Завдяки багаторічному досвіду ми забезпечуємо професійний
            догляд за вашими речами.
          </p>

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>
              Розрахувати вартість
            </button>

            <button className={styles.secondaryBtn}>
              Пошук відділення
            </button>
          </div>
        </div>

        <div className={styles.heroRight}>
          <img
            src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac"
            alt="cleaning"
          />
        </div>
      </section>

      <section className={styles.about}>
        <h2>Про нас</h2>

        <div className={styles.aboutText}>
          <p>
            Ми працюємо у сфері хімчистки вже більше 20 років,
            постійно вдосконалюємо технології.
          </p>

          <p>
            Використовуємо сучасне обладнання та безпечні засоби
            для всіх типів тканин.
          </p>

          <p>
            Гарантуємо якість, швидкість та дбайливе ставлення
            до кожної речі.
          </p>
        </div>

        <img
          className={styles.teamImage}
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="team"
        />
      </section>
    </div>
  );
}