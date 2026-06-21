import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../components/Card/Card";
import styles from "./Services.module.css";

export default function CategoryPage() {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/categories/${id}`)
      .then(res => res.json())
      .then(data => setCategory(data))
      .catch(err => console.error("Category error:", err));

    fetch(`http://127.0.0.1:8000/services/category/${id}`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>{category ? category.name : "Завантаження..."}</h1>
        {!loading && (
          <p>{services.length} {services.length === 1 ? "послуга" : "послуг"}</p>
        )}
      </div>

      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          Завантаження послуг…
        </div>
      ) : services.length === 0 ? (
        <div className={styles.empty}>Послуги не знайдено</div>
      ) : (
        <div className={styles.cardsWrapper}>
          {services.map((service) => (
            <Card
              key={service.id}
              id={service.id}
              imageUrl={service.image?.link}
              name={service.name}
              price={service.price}
              rating={service.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}