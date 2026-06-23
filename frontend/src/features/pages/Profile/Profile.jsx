import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import UserOrders from "./UserOrders";
import styles from "./Profile.module.css";
import { useProfile } from "../../../hooks/useProfile";

const TABS = [
  { id: "info", label: "👤 Профіль" },
  { id: "orders", label: "📦 Замовлення" },
];

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const {
    tab,
    setTab,
    editing,
    setEditing,
    form,
    error,
    saving,
    success,
    startEdit,
    handleChange,
    handleSave,
  } = useProfile(user, updateUser);

  if (!user) {
    return (
      <div className={styles.empty}>
        <p>Ви не авторизовані.</p>
        <button className={styles.btn} onClick={() => navigate("/")}>
          На головну
        </button>
      </div>
    );
  }

  const fullName = [user.surname, user.name, user.patronymic]
    .filter(Boolean)
    .join(" ");

  const initials = [user.name?.[0], user.surname?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.hero}>
          <div className={styles.avatar}>{initials}</div>

          <div>
            <h1 className={styles.name}>{fullName}</h1>
            <span className={styles.role}>{user.role}</span>
          </div>

          <button
            className={styles.logoutBtn}
            onClick={() => logout() || navigate("/")}
          >
            🚪 Вийти
          </button>
        </div>

        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${
                tab === t.id ? styles.tabActive : ""
              }`}
              onClick={() => {
                setTab(t.id);
                setEditing(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          {tab === "info" && (
            <>
              {success && (
                <p className={styles.success}>
                  ✅ Дані успішно збережено
                </p>
              )}

              {!editing ? (
                <div className={styles.info}>
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Телефон" value={user.phone_number} />
                  <InfoRow label="Ім'я" value={user.name} />
                  <InfoRow label="Прізвище" value={user.surname} />

                  {user.patronymic && (
                    <InfoRow
                      label="По батькові"
                      value={user.patronymic}
                    />
                  )}

                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={startEdit}
                  >
                    Редагувати профіль
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSave} className={styles.form}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />

                  {error && <p className={styles.error}>{error}</p>}

                  <button disabled={saving}>
                    {saving ? "Збереження..." : "Зберегти"}
                  </button>
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