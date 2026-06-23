import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar     from "./comonents/Sidebar";
import OrdersPanel from "./panels/OrdersPanel";
import StaffPanel  from "./panels/StaffPanel";
import UsersPanel  from "./panels/UsersPanel";
import ExportPanel from "./panels/ExportPanel";
import styles from "./Admin.module.css";

const PAGE_TITLES = {
  orders: "Управління замовленнями",
  staff:  "Персонал",
  users:  "Клієнти",
  export: "Експорт даних",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState("orders");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }, [navigate]);

  return (
    <div className={`${styles.root} ${styles.layout}`}>
      {/* ── Сайдбар ── */}
      <Sidebar
        active={activePanel}
        setActive={setActivePanel}
        onLogout={handleLogout}
      />

      {/* ── Основна область ── */}
      <div className={styles.main}>
        {/* Топбар */}
        <div className={styles.topbar}>
          <h1 className={styles.pageTitle}>
            {PAGE_TITLES[activePanel] ?? "Адмін-панель"}
          </h1>
        </div>

        {/* Вміст панелі */}
        <div className={styles.content}>
          {activePanel === "orders" && <OrdersPanel />}
          {activePanel === "staff"  && <StaffPanel  />}
          {activePanel === "users"  && <UsersPanel  />}
          {activePanel === "export" && <ExportPanel />}
        </div>
      </div>
    </div>
  );
}