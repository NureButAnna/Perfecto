import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AllServices.module.css";

export default function AllServices() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/categories/")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className={styles.container}>
      <h1>Категорії послуг</h1>

      <div className={styles.categoriesGrid}>
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className={styles.categoryBox}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}