import styles from './ReviewForm.module.css';
import { useState, useEffect } from "react";
import { useAuth } from "../../../../../../context/AuthContext";
import { submitReview } from "../../../../../../api/reviewApi";

export default function ReviewForm({ isOpen, onClose, onSubmit }) {
  const { user, openLogin } = useAuth();

  const [rating, setRating]     = useState(0);
  const [serviceId, setServiceId] = useState("");
  const [comment, setComment]   = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/services/")
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  useEffect(() => {
    if (isOpen && !user) {
      onClose();
      openLogin();
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  async function handleSubmit() {
    if (!rating)        { setError("Будь ласка, оцініть сервіс"); return; }
    if (!serviceId)     { setError("Оберіть послугу"); return; }
    if (!comment.trim()) { setError("Напишіть коментар"); return; }

    setError("");
    setLoading(true);
    try {
      await submitReview({ text: comment, service_id: Number(serviceId), rating });
      onSubmit?.();
      onClose();
      setRating(0);
      setServiceId("");
      setComment("");
    } catch {
      setError("Не вдалося відправити відгук. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Написати відгук</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.inputGroup}>
          <label>Оберіть послугу</label>
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            <option value="">Виберіть послугу</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.ratingSection}>
          <p>Оцініть сервіс</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? styles.activeStar : styles.star}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Коментар</label>
          <textarea
            maxLength={1500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Поділіться враженнями..."
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button className={styles.cancelBtn} onClick={onClose}>Скасувати</button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Надсилання…" : "Залишити відгук"}
          </button>
        </div>
      </div>
    </div>
  );
}