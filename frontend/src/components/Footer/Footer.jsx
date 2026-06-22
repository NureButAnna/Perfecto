import styles from './Footer.module.css';
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>

        <div className={styles.footerLeft}>
          <h2 className={styles.logo}>Perfecto</h2>

          <p className={styles.footerPhone}>
            +38 (050) 678 99 00
          </p>

          <p className={styles.footerEmail}>
            drycleaning.perfecto@gmail.com
          </p>

          <div className={styles.footerWorktime}>
            <p>З 9:00 до 19:00 у будні дні</p>
            <p>З 10:00 до 15:00 у вихідні</p>
          </div>
        </div>

        <div className={styles.footerNav}>
          <a href="/">Головна</a>
          <a href="/">Послуги</a>
          <a href="/pricelist">Прайс-лист</a>
          <a href="/photo">Фото-аналіз</a>
          <a href="/delivery">Доставка</a>
        </div>

        <div className={styles.footerSocials}>
          <h3>Ми в соц мережах</h3>

          <div className={styles.socialIcons}>
            <a href="https://www.instagram.com/perfectodryclean/"> <FaInstagram /></a>
            <a href="https://www.facebook.com/?locale=uk_UA"> <FaFacebookF /></a>
            <a href="https://www.tiktok.com/uk-UA/"> <FaTiktok /></a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© Perfecto, 2012-2026. Всі права захищені</p>
      </div>
    </footer>
  );
}