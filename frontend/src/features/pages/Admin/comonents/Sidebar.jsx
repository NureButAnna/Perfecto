import styles from "../Admin.module.css";

const MENU = [
  { id: "orders", label: "Замовлення",    icon: "📝" },
  { id: "staff",  label: "Персонал",      icon: "👨‍💼" },
  { id: "users",  label: "Клієнти",       icon: "👤" },
  { id: "export", label: "Експорт даних", icon: "📥" },
];

export default function Sidebar({ active, setActive, onLogout}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>✨ Perfecto Admin</div>

      <nav className={styles.sidebarNav}>
        {MENU.map((m) => (
          <button
            key={m.id}
            className={`${styles.sidebarItem} ${active === m.id ? styles.sidebarItemActive : ""}`}
            onClick={() => setActive(m.id)}
          >
            <span>{m.icon}</span>
            {m.label}
            {m.badge > 0 && (
              <span className={styles.navBadge}>{m.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <button className={styles.logoutBtn} onClick={onLogout}>
        🚪 Вийти
      </button>
    </aside>
  );
}