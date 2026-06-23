import { useState, useEffect } from "react";
import styles from "./Reviews.module.css";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm/ReviewForm.jsx";
import { getReviews } from "../../../../../api/reviewApi.js";
import { useTranslation } from "react-i18next";

export default function ReviewsSection() {
  const { t } = useTranslation();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);

  const fetchReviews = () => {
    setIsLoading(true);
    getReviews()
      .then((data) => setReviews(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  return (
    <section className={styles.reviews}>
      <div className={styles.container}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.sectionTitleDark}>{t("reviews.title")}</h2>
          <a href="#" className={styles.reviewsLink} onClick={() => setIsAllReviewsOpen(true)}>
            {t("reviews.viewAll")}
          </a>
        </div>

        {isAllReviewsOpen && (
          <div className={styles.overlay} onClick={() => setIsAllReviewsOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setIsAllReviewsOpen(false)}>✕</button>
              <h2>{t("reviews.allTitle")}</h2>
              <div className={styles.reviewsGrid}>
                {reviews.map((r) => <ReviewCard key={r.id ?? r.author} review={r} />)}
              </div>
            </div>
          </div>
        )}

        {isLoading && <p className={styles.statusText}>{t("reviews.loading")}</p>}
        {error && <p className={styles.statusText}>⚠️ {error}</p>}
        {!isLoading && !error && reviews.length === 0 && (
          <p className={styles.statusText}>{t("reviews.empty")}</p>
        )}

        <div className={styles.reviewsGrid}>
          {reviews.slice(0, 3).map((r) => <ReviewCard key={r.id ?? r.author} review={r} />)}
        </div>

        <div className={styles.servicesBtnRow}>
          <button className={styles.btnPrimary} onClick={() => setIsReviewOpen(true)}>
            {t("reviews.leaveReview")}
          </button>
        </div>

        <ReviewForm isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} onSubmit={fetchReviews} />
      </div>
    </section>
  );
}