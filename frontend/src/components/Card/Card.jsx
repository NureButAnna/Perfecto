import styles from './Card.module.css';
import { FaStar, FaRegStar } from "react-icons/fa";

export default function Card({
  imageUrl,
  name,
  price,
  rating
}) {

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating
          ? <FaStar key={i} className="star" />
          : <FaRegStar key={i} className="star" />
      );
    }

    return stars;
  };

  return (
      <div className={styles.card}>
      <img
        src={imageUrl}
        alt={name}
        className={styles.cardImage}
      />

      <div className={styles.container}>
        <h3>{name}</h3>

        <div className={styles.rating}>
          {renderStars()}
        </div>

        <p className={styles.price}>
          від {price} грн
        </p>

        <button className={styles.orderButton}>
          Замовити послугу
        </button>
      </div>
    </div>
  );
}