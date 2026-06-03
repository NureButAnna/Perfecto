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

  const onDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const onSelect = (e) => {
    handleFile(e.target.files[0]);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* TITLE */}
        <h1 className={styles.title}>Оцінка вартості за фото</h1>
        <p className={styles.subtitle}>
          Сфотографуйте річ і завантажте її — ШІ визначить тип тканини, складність обробки та попередню вартість.
        </p>

        {/* STEPS */}
        <div className={styles.steps}>
          <div className={styles.card}>
            <h2>01</h2>
            <p><b>Сфотографуйте річ</b></p>
            <span>Добре освітлення + чистий фон</span>
          </div>

          <div className={styles.card}>
            <h2>02</h2>
            <p><b>ШІ аналізує</b></p>
            <span>Тип тканини та складність</span>
          </div>

          <div className={styles.card}>
            <h2>03</h2>
            <p><b>Отримайте оцінку</b></p>
            <span>Попередня ціна за кілька секунд</span>
          </div>
        </div>

        {/* UPLOAD */}
        <div
          className={styles.upload}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <img src={preview} alt="preview" className={styles.preview} />
          ) : (
            <>
              <div className={styles.icon}>📷</div>
              <p>Натисніть або перетягніть фото</p>
              <span>Підтримуються JPG, PNG, WebP</span>
            </>
          )}

          <input type="file" onChange={onSelect} />
        </div>

        {/* DESCRIPTION */}
        <textarea
          className={styles.textarea}
          placeholder="Додатковий опис (необов'язково)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* BUTTON */}
        <button className={styles.button}>
          Визначити вартість
        </button>
      </div>
    </div>
  );
}