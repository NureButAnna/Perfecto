import { Link } from "react-router-dom";
import styles from "../Services.module.css";

export default function CategoryDropdown({ categories = [], onClose }) {
  return (
    <div className={styles.menu}>
      {categories.map(category => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          onClick={onClose}
          className={styles.item}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}