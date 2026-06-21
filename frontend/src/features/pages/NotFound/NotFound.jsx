import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Сторінку не знайдено</h1>
        <p className={styles.hint}>
          Можливо, її перемістили або вона ніколи не існувала.
        </p>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => navigate("/")}>
            На головну
          </button>
          <button className={styles.btnGhost} onClick={() => navigate(-1)}>
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}