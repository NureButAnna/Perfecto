import { useState, useEffect } from "react";
import styles from "./Reviews.module.css";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm/ReviewForm.jsx";
import { getReviews } from "../../../../../api/reviewApi.js";

export default function ReviewsSection() {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = () => {
    setIsLoading(true);
    getReviews()
      .then((data) => setReviews(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className={styles.reviews}>
      <div className={styles.container}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.sectionTitleDark}>Відгуки</h2>
          <a href="#" className={styles.reviewsLink}>
            Переглянути всі →
          </a>
        </div>

        {isLoading && (
          <p className={styles.statusText}>Завантаження відгуків…</p>
        )}

        {error && (
          <p className={styles.statusText}>⚠️ {error}</p>
        )}

        {!isLoading && !error && reviews.length === 0 && (
          <p className={styles.statusText}>Відгуків ще немає. Будьте першим!</p>
        )}

        <div className={styles.reviewsGrid}>
          {reviews.map((r) => (
            <ReviewCard key={r.id ?? r.author} review={r} />
          ))}
        </div>

        <div className={styles.servicesBtnRow}>
          <button
            className={styles.btnPrimary}
            onClick={() => setIsReviewOpen(true)}
          >
            Залишити відгук
          </button>
        </div>

        <ReviewForm
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          onSubmit={fetchReviews}
        />
      </div>
    </section>
  );
}