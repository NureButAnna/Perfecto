import styles from './Card.module.css';
import { FaStar, FaRegStar } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";

export default function Card(props) {
  const {
    id,
    name,
    price,
    rating = 0,
    imgUrl,
    imageUrl,
    image,
    img_url
  } = props;

  const { addToCart, cart } = useCart();

  const inCart = cart.some((item) => item.id === id);

  let rawImage =
    imgUrl ||
    imageUrl ||
    image ||
    img_url ||
    null;

  if (rawImage && rawImage.startsWith("/")) {
    rawImage = `http://localhost:8000${rawImage}`;
  }

  const finalImage = rawImage;

  const service = {
    id,
    imageUrl: finalImage,
    name,
    price,
    rating
  };

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className={styles.star} />
      ) : (
        <FaRegStar key={i} className={styles.star} />
      )
    );

  console.log(finalImage);
  return (
    <div className={styles.card}>

      <div className={styles.imageWrap}>
        {finalImage ? (
          <img
            src={finalImage}
            alt={name}
            className={styles.image}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            🖼️
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>

        <div className={styles.rating}>
          {renderStars()}
        </div>

        <p className={styles.price}>
          від {Number(price || 0).toFixed(0)} грн
        </p>

        <button
          className={`${styles.btn} ${inCart ? styles.btnAdded : ""}`}
          onClick={() => addToCart(service)}
        >
          {inCart ? "✓ Додано" : "Замовити послугу"}
        </button>
      </div>
    </div>
  );
}