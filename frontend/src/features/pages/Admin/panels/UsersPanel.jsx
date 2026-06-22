import { useState, useCallback, useEffect } from "react";
import { adminApi } from "../../../../api/adminApi";
import {
  Th,
  Td,
  Loader,
  EmptyState,
  BadgeGreen,
  BadgeRed,
} from "../comonents/AdminTable";
import { isActive } from "../../../../utils/statusHelper";
import styles from "../Admin.module.css";

export default function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити користувача?")) return;

    try {
      await adminApi.deleteUser(id);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminApi.updateUserStatus(id, !isActive(currentStatus));
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();

    return (
      !q ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.sectionHeader} style={{ marginBottom: 14 }}>
        <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>
          Клієнти
        </h2>

        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Пошук клієнта..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                  <Th>Місто</Th>
                  <Th>Статус</Th>
                  <Th>Дії</Th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u) => (
                  <tr key={`user-${u.user_id}`} className={styles.tr}>
                    <Td>{u.user_id}</Td>

                    <Td>
                      <div className={styles.clientCell}>
                        <div className={styles.clientAvatar}>
                          {u.first_name?.[0] ?? ""}
                          {u.last_name?.[0] ?? ""}
                        </div>
                        {u.first_name} {u.last_name}
                      </div>
                    </Td>

                    <Td>{u.email}</Td>

                    <Td>{u.city_id ?? "—"}</Td>

                    <Td>
                      {isActive(u.is_active)
                        ? <BadgeGreen>Активний</BadgeGreen>
                        : <BadgeRed>Заблокований</BadgeRed>}
                    </Td>

                    <Td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.btn} ${
                            isActive(u.is_active)
                              ? styles.btnWarning
                              : styles.btnPrimary
                          } ${styles.btnSm}`}
                          onClick={() =>
                            handleToggleStatus(u.user_id, u.is_active)
                          }
                        >
                          {isActive(u.is_active)
                            ? "Заблокувати"
                            : "Активувати"}
                        </button>

                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => handleDelete(u.user_id)}
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