import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../../../api/adminApi";
import { Th, Td, Loader, EmptyState } from "../comonents/AdminTable";
import OrderModal from "../comonents/OrderModal";
import { STATUS_LABEL, canAdvance, getNextStatus } from "../../../../data/orderStatus";
import styles from "../Admin.module.css";

const FILTERS = [
  { key: "all",       label: "Всі" },
  { key: "new",       label: "Оформлено" },
  { key: "accepted",  label: "Прийнято" },
  { key: "progress",  label: "В процесі" },
  { key: "ready",     label: "Готово" },
  { key: "cancelled", label: "Скасовано" },
];

function getStatusBadgeClass(status) {
  const map = {
    new:       styles.badgeTeal,
    accepted:  styles.badgeYellow,
    progress:  styles.badgeYellow,
    ready:     styles.badgeGreen,
    done:      styles.badgeGray,
    cancelled: styles.badgeRed,
  };
  return map[status] ?? styles.badgeGray;
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function OrdersPanel() {
  const [orders,   setOrders]   = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ordRes, courRes] = await Promise.all([
        adminApi.getOrders(),
        adminApi.getCouriers(),
      ]);
      setOrders(ordRes.data);
      console.log("ORDERS FROM API:", ordRes.data);
      setCouriers(courRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      String(o.id).includes(q) ||
      (`${o.user?.surname ?? ""} ${o.user?.name ?? ""}`).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const metrics = {
    total:    orders.length,
    newCount: orders.filter((o) => o.status === "new" || o.status === "accepted").length,
    proc:     orders.filter((o) => o.status === "progress").length,
    ready:    orders.filter((o) => o.status === "ready").length,
  };

  const handleAdvance = async (orderId, nextStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, nextStatus);
      await load();
      setSelected(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await adminApi.updateOrderStatus(orderId, "cancelled");
      await load();
      setSelected(null);
    } catch (e) {
      console.error(e);
    }
  };

const handleAssignCourier = async (orderId, courierId) => {
  try {
    await adminApi.assignCourier(orderId, courierId);
    await load();
    setSelected(prev => prev ? { ...prev, courier_id: courierId } : null);
  } catch (e) {
    console.error(e);
  }
};

  const handleQuickAdvance = async (e, order) => {
    e.stopPropagation();
    const next = getNextStatus(order.status);
    if (!next) return;
    if ((order.status === "accepted" || order.status === "progress") && !order.courier_id) {
      setSelected(order);
      return;
    }
    await handleAdvance(order.id, next);
  };

  const handleQuickCancel = async (e, orderId) => {
    e.stopPropagation();
    if (!window.confirm(`Скасувати замовлення #${orderId}?`)) return;
    await handleCancel(orderId);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className={styles.metricsGrid} style={{ marginBottom: 18 }}>
        <MetricCard label="Всього замовлень" value={metrics.total}    colorClass={styles.metricIconPink}  icon="📋" />
        <MetricCard label="Нові / Прийняті"  value={metrics.newCount} colorClass={styles.metricIconTeal}  icon="📥" />
        <MetricCard label="В процесі"        value={metrics.proc}     colorClass={styles.metricIconAmber} icon="⚙️" />
        <MetricCard label="Готові"           value={metrics.ready}    colorClass={styles.metricIconGreen} icon="✅" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Замовлення філії</span>

          <div className={styles.searchBox}>
            <span>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Пошук..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterTabs}>
            {FILTERS.map((f) => (
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

        {filtered.length === 0 ? (
          <EmptyState message="Замовлень за обраним фільтром не знайдено." />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <Th>№</Th>
                  <Th>Клієнт</Th>
                  <Th>Послуги</Th>
                  <Th>Вартість</Th>
                  <Th>Статус</Th>
                  <Th>Кур'єр</Th>
                  <Th>Дії</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                const clientName = o.user
                  ? `${o.user.surname ?? ""} ${o.user.name ?? ""}`.trim()
                  : "—";

                const servicesList = o.order_services?.length
                  ? o.order_services.map((s) => s.service?.name ?? "—").join(", ")
                  : "—";

                const courierName = "—"; // поки немає в OrderRead
                const next = getNextStatus(o.status);

                return (
                  <tr key={o.id} className={styles.tr} onClick={() => setSelected(o)}>
                    <Td>
                      <span style={{ fontWeight: 600, color: "var(--pink-600)" }}>#{o.id}</span>
                    </Td>
                    <Td>
                      <div className={styles.clientCell}>
                        <div className={styles.clientAvatar}>{getInitials(clientName)}</div>
                        {clientName}
                      </div>
                    </Td>
                    <Td>{servicesList}</Td>
                    <Td><strong>₴{o.total_cost}</strong></Td>
                    <Td>
                      <span className={`${styles.badge} ${getStatusBadgeClass(o.status)}`}>
                        <span className={styles.badgeDot} />
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </Td>
                    <Td>
                      {o.delivery?.delivery_type === "courier" ? (courierName || "Не призначений") : "—"}
                    </Td>
                      <Td>
                        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                          <button
                            className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                            onClick={(e) => { e.stopPropagation(); setSelected(o); }}
                          >
                            Деталі
                          </button>
                          {canAdvance(o) && next && (
                            <button
                              className={`${styles.btn} ${styles.btnTeal} ${styles.btnSm}`}
                              onClick={(e) => handleQuickAdvance(e, o)}
                            >
                              {STATUS_LABEL[next]}
                            </button>
                          )}
                          {o.status !== "done" && o.status !== "cancelled" && (
                            <button
                              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                              onClick={(e) => handleQuickCancel(e, o.id)}
                            >
                              ✕
                            </button>
                          )}
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

      {selected && (
        <OrderModal
          order={selected}
          couriers={couriers}
          onClose={() => setSelected(null)}
          onAdvance={handleAdvance}
          onCancel={handleCancel}
          onAssignCourier={handleAssignCourier}
        />
      )}
    </div>
  );
}

function MetricCard({ label, value, colorClass, icon }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <span className={styles.metricLabel}>{label}</span>
        <div className={`${styles.metricIcon} ${colorClass}`}>{icon}</div>
      </div>
      <div className={styles.metricValue}>{value}</div>
    </div>
  );
}