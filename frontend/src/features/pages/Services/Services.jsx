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
      .catch(err => console.error("Category error:", err))

    fetch(`http://127.0.0.1:8000/services/category/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <section>
      <h1>
        {category ? category.name : "Завантаження категорії..."}
      </h1>

      {loading && <p>Завантаження...</p>}

      <div className={styles.cardsWrapper}>
        {services.map((service) => (
          <Card
            key={service.id}
            id={service.id}
            imageUrl={service.image_url}
            name={service.name}
            price={service.price}
            rating={service.rating}
          />
        ))}
      </div>
    </section>
  );
}