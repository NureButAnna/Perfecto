import { useState } from "react";
import styles from "./Photo.module.css";

export default function Photo() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Оцінка вартості за фото</h1>
      <p className={styles.subtitle}>
        Сфотографуйте річ і завантажте її — ШІ визначить тип тканини, складність обробки та попередню вартість.
      </p>

      <div className={styles.steps}>
        <div className={styles.card}>
          <h2>01</h2>
          <p>Сфотографуйте річ</p>
          <span>Добре освітлення + чистий фон</span>
        </div>
        <div className={styles.card}>
          <h2>02</h2>
          <p>ШІ аналізує</p>
          <span>Тип тканини та складність</span>
        </div>
        <div className={styles.card}>
          <h2>03</h2>
          <p>Отримайте оцінку</p>
          <span>Попередня ціна за кілька секунд</span>
        </div>
      </div>

      <div
        className={styles.upload}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <img src={preview} alt="preview" className={styles.preview} />
        ) : (
          <>
            <div className={styles.icon}>📷</div>
            <p>Натисніть або перетягніть фото</p>
            <span>JPG, PNG, WebP</span>
          </>
        )}
        <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Додатковий опис (необов'язково)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className={styles.button} disabled={!file}>
        Визначити вартість
      </button>
    </div>
  );
}