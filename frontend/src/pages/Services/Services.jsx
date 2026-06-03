import { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import styles from "./Services.module.css";

export default function Services() {
   const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
        <section>
           <h1>Верхній одяг</h1>
            <div className={styles.cardsWrapper}>
            {services.map((service) => (
              <Card
                key={service.service_id}
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