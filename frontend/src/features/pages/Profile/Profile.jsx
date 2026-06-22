// src/features/pages/Profile/Profile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { authApi } from "../../../api/authApi";
import UserOrders from "./UserOrders";
import styles from "./Profile.module.css";

const TABS = [
  { id: "info",   label: "👤 Профіль" },
  { id: "orders", label: "📦 Замовлення" },
];

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [tab,     setTab]     = useState("info");
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState(null);
  const [error,   setError]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className={styles.empty}>
        <p>Ви не авторизовані.</p>
        <button className={styles.btn} onClick={() => navigate("/")}>На головну</button>
      </div>
    );
  }

  function startEdit() {
    setForm({
      name:         user.name,
      surname:      user.surname,
      patronymic:   user.patronymic ?? "",
      email:        user.email,
      phone_number: user.phone_number,
      password:     "",
    });
    setEditing(true);
    setError("");
    setSuccess(false);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const res = await authApi.updateMe(user.id, payload);
      updateUser(res.data);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Помилка збереження");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const fullName = [user.surname, user.name, user.patronymic].filter(Boolean).join(" ");
  const initials = [user.name?.[0], user.surname?.[0]].filter(Boolean).join("").toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h1 className={styles.name}>{fullName}</h1>
            <span className={styles.role}>{user.role}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Вийти
          </button>
        </div>

        {/* Вкладки */}
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => { setTab(t.id); setEditing(false); }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Вміст */}
        <div className={styles.body}>

          {tab === "info" && (
            <>
              {success && <p className={styles.success}>✅ Дані успішно збережено</p>}

              {!editing ? (
                <div className={styles.info}>
                  <InfoRow label="Email"       value={user.email} />
                  <InfoRow label="Телефон"     value={user.phone_number} />
                  <InfoRow label="Ім'я"        value={user.name} />
                  <InfoRow label="Прізвище"    value={user.surname} />
                  {user.patronymic && <InfoRow label="По батькові" value={user.patronymic} />}
                  <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={startEdit}>
                      ✏️ Редагувати профіль
                    </button>
                  </div>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSave}>
                  <div className={styles.row2}>
                    <Field label="Ім'я *"     name="name"    value={form.name}    onChange={handleChange} required />
                    <Field label="Прізвище *" name="surname" value={form.surname} onChange={handleChange} required />
                  </div>
                  <Field label="По батькові"  name="patronymic"   value={form.patronymic}   onChange={handleChange} />
                  <Field label="Телефон *"    name="phone_number" value={form.phone_number} onChange={handleChange} type="tel" required />
                  <Field label="Email *"      name="email"        value={form.email}        onChange={handleChange} type="email" required />
                  <Field
                    label="Новий пароль (залиште пустим щоб не змінювати)"
                    name="password" type="password"
                    value={form.password} onChange={handleChange}
                  />
                  {error && <p className={styles.error}>{error}</p>}
                  <div className={styles.actions}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={saving}>
                      {saving ? "Збереження…" : "Зберегти"}
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setEditing(false)}>
                      Скасувати
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {tab === "orders" && <UserOrders />}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} />
    </div>
  );
}