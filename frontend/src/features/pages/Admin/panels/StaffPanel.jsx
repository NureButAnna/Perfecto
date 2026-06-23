import { useState, useCallback, useEffect } from "react";
import { adminApi } from "../../../../api/adminApi";
import { Th, Td, Loader, EmptyState, BadgeGreen, BadgeRed } from "../comonents/AdminTable";
import styles from "../Admin.module.css";

const ROLE_LABEL = {
  "адміністратор": "Адміністратор",
  "кур'єр": "Кур'єр",
  "керівник": "Керівник",
};

export default function StaffPanel() {
  const [staff,       setStaff]       = useState([]);
  const [drycleaners, setDrycleaners] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [filterDC,    setFilterDC]    = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [staffRes, dcRes] = await Promise.all([
        adminApi.getStaff(),
        adminApi.getDryCleaners(),
      ]);
      setStaff(staffRes.data);
      setDrycleaners(dcRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити співробітника?")) return;
    await adminApi.deleteStaff(id);
    load();
  };

  const handleToggleStatus = async (u) => {
    await adminApi.updateStaffStatus(u.id, !u.is_active);
    load();
  };

  const filtered = staff.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${u.surname} ${u.name}`.toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q);
    const matchDC =
      filterDC === "all" || String(u.dry_cleaner_id) === filterDC;
    return matchSearch && matchDC;
  });

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.sectionHeader} style={{ marginBottom: 14 }}>
        <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>Персонал</h2>

        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Пошук співробітника..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.searchInput}
          style={{ maxWidth: 240 }}
          value={filterDC}
          onChange={(e) => setFilterDC(e.target.value)}
        >
          <option value="all">Всі філії</option>
          {drycleaners.map((dc) => (
            <option key={dc.id} value={String(dc.id)}>
              {dc.city}, {dc.street}{dc.house_number ? `, ${dc.house_number}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        {filtered.length === 0 ? (
          <EmptyState message="Співробітників не знайдено." />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Ім'я</Th>
                  <Th>Email</Th>
                  <Th>Телефон</Th>
                  <Th>Роль</Th>
                  <Th>Філія</Th>
                  <Th>Статус</Th>
                  <Th>Дії</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const dc = drycleaners.find((d) => d.id === u.dry_cleaner_id);
                  const dcLabel = dc
                    ? `${dc.city}, ${dc.street}${dc.house_number ? `, ${dc.house_number}` : ""}`
                    : "—";

                  return (
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
                      <Td>{ROLE_LABEL[u.role] ?? u.role}</Td>
                      <Td>{dcLabel}</Td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}