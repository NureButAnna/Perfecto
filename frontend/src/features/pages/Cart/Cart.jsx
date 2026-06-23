// src/features/pages/Cart/Cart.jsx
import { Link } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import styles from "./Cart.module.css";

export default function Cart() {
  const { cart, removeFromCart, addToCart, decrease, totalPrice } = useCart();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>Кошик</h1>
          {cart.length > 0 && (
            <span className={styles.count}>{cart.length} послуг</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🛒</span>
            <p className={styles.emptyText}>Кошик порожній</p>
            <p className={styles.emptyHint}>Додайте послуги з прайс-листу</p>
            <Link to="/pricelist" className={styles.emptyBtn}>
              Перейти до послуг
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>


            <div className={styles.items}>
              {cart.map((item) => (
                <div key={item.id} className={styles.item}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                  ) : (
                    <div className={styles.itemImagePlaceholder}>✂️</div>
                  )}

                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>{Number(item.price).toFixed(2)} грн / од.</p>
                  </div>


                  <div className={styles.controls}>
                    <button
                      className={styles.controlBtn}
                      onClick={() => decrease(item.id)}
                    >
                      −
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      className={styles.controlBtn}
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.itemTotal}>
                    {(item.quantity * item.price).toFixed(2)} грн
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id)}
                    title="Видалити"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Підсумок</h2>

              <div className={styles.summaryRows}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.summaryRow}>
                    <span className={styles.summaryName}>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{(item.quantity * item.price).toFixed(2)} грн</span>
                  </div>
                ))}
              </div>

              <div className={styles.divider} />

              <div className={styles.total}>
                <span>Разом</span>
                <span className={styles.totalPrice}>{Number(totalPrice).toFixed(2)} грн</span>
              </div>

              <Link to="/checkout" className={styles.checkoutBtn}>
                Оформити замовлення →
              </Link>

              <Link to="/pricelist" className={styles.continueBtn}>
                ← Продовжити вибір
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}