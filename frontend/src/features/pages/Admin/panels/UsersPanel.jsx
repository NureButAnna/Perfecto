import { useState, useCallback, useEffect } from "react";
import { adminApi } from "../../../../api/adminApi";
import {
  Th, Td, Loader, EmptyState, BadgeGreen, BadgeRed,
} from "../comonents/AdminTable";
import styles from "../Admin.module.css";

const STATUS_FILTERS = [
  { key: "all",    label: "Всі" },
  { key: "active", label: "Активні" },
  { key: "blocked",label: "Заблоковані" },
];

export default function UsersPanel() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити користувача?")) return;
    try {
      await adminApi.deleteUser(id);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (u) => {
    try {
      await adminApi.updateUserStatus(u.id, !u.is_active);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${u.surname} ${u.name}`.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "active" && u.is_active) ||
      (filter === "blocked" && !u.is_active);
    return matchSearch && matchFilter;
  });

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.sectionHeader} style={{ marginBottom: 14 }}>
        <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>Клієнти</h2>

        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Пошук клієнта..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterTabs}>
          {STATUS_FILTERS.map((f) => (
            <span
              key={f.key}
              className={`${styles.filterTab} ${filter === f.key ? styles.filterTabActive : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        {filtered.length === 0 ? (
          <EmptyState message="Клієнтів не знайдено." />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Ім'я</Th>
                  <Th>Email</Th>
                  <Th>Телефон</Th>
                  <Th>Статус</Th>
                  <Th>Дії</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className={styles.tr}>
                    <Td>{u.id}</Td>
                    <Td>
                      <div className={styles.clientCell}>
                        <div className={styles.clientAvatar}>
                          {u.surname?.[0]}{u.name?.[0]}
                        </div>
                        {u.surname} {u.name}
                      </div>
                    </Td>
                    <Td>{u.email}</Td>
                    <Td>{u.phone_number ?? "—"}</Td>
                    <Td>
                      {u.is_active
                        ? <BadgeGreen>Активний</BadgeGreen>
                        : <BadgeRed>Заблокований</BadgeRed>}
                    </Td>
                    <Td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.btn} ${u.is_active ? styles.btnWarning : styles.btnPrimary} ${styles.btnSm}`}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.is_active ? "Заблокувати" : "Активувати"}
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => handleDelete(u.id)}
                        >
                          Видалити
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}