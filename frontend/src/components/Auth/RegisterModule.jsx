import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./AuthModal.module.css";

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "", surname: "", patronymic: "",
    email: "", phone_number: "", password: "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        ...form,
        role: "клієнт", // роль за замовчуванням
        is_active: true,
      });
      onClose();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError(typeof detail === "string" ? detail : "Помилка реєстрації");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Реєстрація</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label>Ім'я *</label>
              <input name="name" placeholder="Ім'я" value={form.name} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Прізвище *</label>
              <input name="surname" placeholder="Прізвище" value={form.surname} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.field}>
            <label>По батькові</label>
            <input name="patronymic" placeholder="По батькові (необов'язково)" value={form.patronymic} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Номер телефону *</label>
            <input name="phone_number" type="tel" placeholder="+380XXXXXXXXX" value={form.phone_number} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label>Електронна пошта *</label>
            <input name="email" type="email" placeholder="Введіть email" value={form.email} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label>Пароль *</label>
            <span className={styles.hint}>Не менше 4 символів</span>
            <input name="password" type="password" placeholder="Введіть пароль" value={form.password} onChange={handleChange} required minLength={4} />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Завантаження…" : "Зареєструватися"}
          </button>

          <div className={styles.switchRow}>
            <span>Вже маєте акаунт?</span>
            <button type="button" className={styles.switchBtn} onClick={onSwitchToLogin}>
              Увійти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}