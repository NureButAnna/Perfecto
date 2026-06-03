import styles from './Header.module.css';
import { IoSearch, IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topHeader}>
        <button className={styles.menuButton}>UA</button>

        <div className={styles.searchBox}>
          <input type={styles.text} placeholder="Пошук" />
          <button><IoSearch /></button>
        </div>

        <h1 className={styles.logo}>Perfecto</h1>

        <div className={styles.phone}>
          +38 (050) 678 99 00
        </div>

        <div className={styles.icons}>
          <button className={styles.menuButton}><FaRegUser size={24}/></button>
          <button className={styles.menuButton}><IoCartOutline size={28}/><img src="" /></button>
        </div>
      </div>

      <nav className={styles.navbar}>
          <Link to="/">Головна</Link>
          <Link to="/services">Послуги</Link>
          <Link to="/photo">Прайс-лист</Link>
          <Link to="/photo">Фото-аналіз</Link>
          <Link to="/">Доставка</Link>
      </nav>
    </header>
  );
}