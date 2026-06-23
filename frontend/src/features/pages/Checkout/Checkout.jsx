import { useEffect } from "react";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../context/AuthContext";
import { useAuthModal } from "../../../hooks/useAuthModal";
import { useCheckoutForm } from "../../../hooks/useCheckoutForm";
import { useDryCleaners } from "../../../hooks/useDryCleaners";
import { useCheckout } from "../../../hooks/useChekout";

import LoginModal from "../../../components/Auth/LoginModule";
import RegisterModal from "../../../components/Auth/RegisterModule";
import styles from "./Checkout.module.css";

const PAYMENT_METHODS = [
  { value: "card", label: "💳 Картка" },
  { value: "cash", label: "💵 Готівка" },
];

export default function Checkout() {
  const { cart, totalPrice } = useCart();
  const { user } = useAuth();

  const {
    isLoginOpen,
    isRegisterOpen,
    openLogin,
    closeModal,
    switchToLogin,
    switchToRegister,
  } = useAuthModal();

  const { form, handleChange } = useCheckoutForm();

  const {
    drycleaners,
    loading: loadingDC,
  } = useDryCleaners();

  const {
    submitOrder,
    submitting,
    error,
  } = useCheckout();

  useEffect(() => {
    if (!user) openLogin();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e) {
    e.preventDefault();

    await submitOrder({
      form,
      cart,
      user,
      openLogin,
    });
  }

  const isCourier = form.delivery_type === "courier";
  const isNovaPoshta = form.delivery_type === "nova_poshta";

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>

          <div className={styles.card}>
            <h2>Філія</h2>
            {loadingDC ? (
              <p className={styles.hint}>Завантаження...</p>
            ) : (
              <select
                name="dry_cleaner_id"
                className={styles.select}
                value={form.dry_cleaner_id}
                onChange={handleChange}
                required
              >
                <option value="">Оберіть філію</option>
                {drycleaners.map((dc) => (
                  <option key={dc.id} value={dc.id}>
                    {dc.city}, {dc.street}{dc.house_number ? `, ${dc.house_number}` : ""} — {dc.phone_number}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className={styles.card}>
            <h2>Спосіб доставки</h2>

            <label className={styles.radio}>
              <input
                type="radio" name="delivery_type" value="courier"
                checked={isCourier} onChange={handleChange}
              />
              🚚 Кур'єр забере речі за адресою
            </label>

            <label className={styles.radio}>
              <input
                type="radio" name="delivery_type" value="nova_poshta"
                checked={isNovaPoshta} onChange={handleChange}
              />
              📦 Нова Пошта
            </label>

            {isCourier && (
              <div className={styles.fields}>
                <input name="city"         placeholder="Місто *"   value={form.city}         onChange={handleChange} required />
                <input name="street"       placeholder="Вулиця"    value={form.street}       onChange={handleChange} />
                <div className={styles.row}>
                  <input name="house_number" placeholder="Будинок" value={form.house_number} onChange={handleChange} />
                  <input name="flat_number"  placeholder="Квартира" value={form.flat_number} onChange={handleChange} />
                </div>
              </div>
            )}

            {isNovaPoshta && (
              <div className={styles.fields}>
                <input name="city"               placeholder="Місто *"           value={form.city}               onChange={handleChange} required />
                <input name="nova_poshta_branch" placeholder="Відділення НП *"   value={form.nova_poshta_branch} onChange={handleChange} required />
              </div>
            )}

            <div className={styles.fields} style={{ marginTop: 12 }}>
              <label className={styles.fieldLabel}>Дата та час доставки *</label>
              <input
                type="datetime-local"
                name="delivery_datetime"
                value={form.delivery_datetime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.card}>
            <h2>Спосіб оплати</h2>
            {PAYMENT_METHODS.map((pm) => (
              <label key={pm.value} className={styles.radio}>
                <input
                  type="radio" name="payment_method" value={pm.value}
                  checked={form.payment_method === pm.value}
                  onChange={handleChange}
                />
                {pm.label}
              </label>
            ))}
          </div>

          <div className={styles.card}>
            <h2>Коментар</h2>
            <textarea
              rows={3}
              name="comment"
              placeholder="Додаткові побажання..."
              value={form.comment}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.summary}>
            <h2>Ваше замовлення</h2>

            {cart.length === 0 ? (
              <p className={styles.hint}>Кошик порожній</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div>
                    <strong>{item.name}</strong>
                    <div className={styles.itemQty}>
                      {item.quantity} × {item.price} грн
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {(item.quantity * item.price).toFixed(2)} грн
                  </div>
                </div>
              ))
            )}

            <div className={styles.total}>Разом: {totalPrice} грн</div>

            {error && <p className={styles.error}>{error}</p>}

            {!user ? (
              <button className={styles.button} onClick={openLogin}>
                Увійдіть для оформлення
              </button>
            ) : (
              <button
                className={styles.button}
                onClick={handleSubmit}
                disabled={submitting || cart.length === 0}
              >
                {submitting ? "Оформлення…" : "Підтвердити замовлення"}
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeModal}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeModal}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}