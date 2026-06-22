import styles from './Reviews.module.css';

export default function ReviewCard({ review }) {
  const formattedDate = review.date
    ? new Date(review.date).toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  const fullName = review.user
    ? [review.user.surname, review.user.name].filter(Boolean).join(" ")
    : null;

  const initials = review.user
    ? [review.user.surname, review.user.name]
        .filter(Boolean)
        .map((n) => n[0].toUpperCase())
        .join("")
    : "?";

  const rating = review.rating ?? 5;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewStars}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s}>{s <= rating ? "★" : "☆"}</span>
        ))}
      </div>

      <p className={styles.reviewText}>{review.text}</p>

      <div className={styles.reviewFooter}>
        <div className={styles.reviewAvatarRow}>
          <div className={styles.reviewAvatar}>{initials}</div>
          {fullName && (
            <span className={styles.reviewAuthor}>{fullName}</span>
          )}
        </div>

        <div className={styles.reviewMetaRow}>
          {review.service?.name && (
            <span className={styles.reviewService}>{review.service.name}</span>
          )}
          {formattedDate && (
            <span className={styles.reviewDate}>{formattedDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}