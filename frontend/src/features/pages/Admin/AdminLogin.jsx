import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import { authApi } from "../../../api/authApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem("access_token", response.data.access_token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.detail || "Невірний email або пароль");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Ліва панель — форма ── */}
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>✦</span>
          <span className={styles.brandName}>Perfecto</span>
        </div>

        <h1 className={styles.title}>Вхід для адміністратора</h1>
        <p className={styles.subtitle}>Введіть дані свого облікового запису</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="admin@perfecto.ua"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Пароль</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Завантаження..." : "Увійти"}
          </button>
        </form>
      </div>

      {/* ── Права панель — ілюстрація ── */}
      <div className={styles.right}>
        <div className={styles.illustration}>🧺</div>
        <h2 className={styles.rightTitle}>Панель управління</h2>
        <p className={styles.rightSubtitle}>
          Керуйте замовленнями, персоналом та клієнтами в одному місці
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📦</span>
            Управління замовленнями
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>👥</span>
            Клієнти та персонал
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            Експорт та аналітика
          </div>
        </div>
      </div>

    </div>
  );
}