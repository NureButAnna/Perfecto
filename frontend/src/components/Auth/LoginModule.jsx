// src/components/Auth/LoginModal.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./AuthModal.module.css";

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Невірний email або пароль");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Вхід до акаунту</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Електронна пошта *</label>
            <input
              type="email"
              placeholder="Введіть email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Пароль *</label>
            <input
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Завантаження…" : "Увійти"}
          </button>

          <div className={styles.switchRow}>
            <span>Немає акаунту?</span>
            <button type="button" className={styles.switchBtn} onClick={onSwitchToRegister}>
              Зареєструватися
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}