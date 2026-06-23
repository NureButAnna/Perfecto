  import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../components/Card/Card";
import styles from "./Services.module.css";
import {
  getCategory,
  getServicesByCategory,
} from "../../../api/categoryApi";

export default function CategoryPage() {
  const { id } = useParams();

  const [services, setServices] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryData, servicesData] = await Promise.all([
          getCategory(id),
          getServicesByCategory(id),
        ]);

        setCategory(categoryData);
        setServices(servicesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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