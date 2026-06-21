import { useState } from "react";
import { adminApi } from "../../../../api/adminApi";
import styles from "../Admin.module.css";

const EXPORT_OPTIONS = [
  { key: "orders",  label: "Замовлення",  icon: "📋", desc: "Всі замовлення філії з деталями" },
  { key: "clients", label: "Клієнти",     icon: "👤", desc: "База клієнтів" },
  { key: "staff",   label: "Персонал",    icon: "👨‍💼", desc: "Список персоналу" },
  { key: "revenue", label: "Фінанси",     icon: "💰", desc: "Звіт про доходи" },
];

export default function ExportPanel() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [loading,  setLoading]  = useState(null);

  const handleExport = async (key) => {
    setLoading(key);
    try {
      const res = await adminApi.exportData(key, { from: dateFrom, to: dateTo });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href    = url;
      a.download = `${key}_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Помилка при експорті. Спробуйте ще раз.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h2 className={styles.panelTitle}>Експорт даних</h2>

      {/* Діапазон дат */}
      <div className={styles.section} style={{ marginBottom: 18 }}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Фільтр за датою</span>
        </div>
        <div style={{ padding: "16px 18px", display: "flex", gap: 16, alignItems: "center" }}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Від</label>
            <input
              type="date"
              className={styles.select}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>До</label>
            <input
              type="date"
              className={styles.select}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <button
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={() => { setDateFrom(""); setDateTo(""); }}
          >
            Скинути
          </button>
        </div>
      </div>

      {/* Варіанти експорту */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Оберіть тип звіту</span>
        </div>
        <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {EXPORT_OPTIONS.map((opt) => (
            <div
              key={opt.key}
              style={{
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-md)",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 28 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--gray-800)" }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--gray-600)", marginTop: 2 }}>
                  {opt.desc}
                </div>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
                disabled={loading === opt.key}
                onClick={() => handleExport(opt.key)}
              >
                {loading === opt.key ? "..." : "CSV"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}