// src/features/pages/Profile/UserOrders.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ordersApi } from "../../../api/ordersApi";
import { STATUS_LABEL } from "../../../data/orderStatus";
import styles from "./UserOrders.module.css";

function getStatusClass(status) {
  const map = {
    new:       styles.badgeNew,
    accepted:  styles.badgeAccepted,
    progress:  styles.badgeProgress,
    ready:     styles.badgeReady,
    done:      styles.badgeDone,
    cancelled: styles.badgeCancelled,
  };
  return map[status] ?? styles.badgeDone;
}

export default function UserOrders() {
  const { user } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [expanded, setExpanded] = useState(null); // id відкритого замовлення

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await ordersApi.getUserOrders(user.id);
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
      );
      setOrders(sorted);
    } catch {
      setError("Не вдалося завантажити замовлення");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function handleCancel(orderId) {
    if (!window.confirm("Скасувати замовлення?")) return;
    try {
      await ordersApi.deleteOrder(orderId);
      await load();
    } catch {
      alert("Не вдалося скасувати замовлення");
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString("uk-UA", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  if (loading) return <div className={styles.loader}>Завантаження...</div>;
  if (error)   return <div className={styles.error}>{error}</div>;

  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📦</span>
        <p>У вас ще немає замовлень</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {orders.map((order) => {
        const isOpen = expanded === order.id;
        const canCancel = order.status === "new";

        return (
          <div key={order.id} className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}>
            <div className={styles.cardHead} onClick={() => setExpanded(isOpen ? null : order.id)}>
              <div className={styles.cardLeft}>
                <span className={styles.orderId}>#{order.id}</span>
                <span className={styles.date}>{formatDate(order.creation_date)}</span>
              </div>

              <div className={styles.cardRight}>
                <span className={`${styles.badge} ${getStatusClass(order.status)}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
                <span className={styles.price}>₴{Number(order.total_cost).toFixed(2)}</span>
                <span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {isOpen && (
              <div className={styles.cardBody}>
                <StatusBar status={order.status} />
                {order.order_services?.length > 0 && (
                  <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>Послуги</h4>
                    <div className={styles.servicesList}>
                      {order.order_services.map((s, i) => (
                        <div key={i} className={styles.serviceRow}>
                          <span>{s.service?.name ?? `Послуга #${s.service_id}`}</span>
                          <span className={styles.serviceQty}>
                            {s.quantity ?? s.number ?? 1} шт × ₴{s.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.section}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Оплата</span>
                    <span>{order.payment_method ?? "—"}</span>
                  </div>
                  {order.comment && (
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Коментар</span>
                      <span>{order.comment}</span>
                    </div>
                  )}
                </div>

                {/* Кнопка скасування */}
                {canCancel && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancel(order.id)}
                  >
                    Скасувати замовлення
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Прогрес-бар статусів ──────────────────────────────────────
const STEPS = ["new", "accepted", "progress", "ready", "done"];

function StatusBar({ status }) {
  const isCancelled = status === "cancelled";
  const currentIdx  = STEPS.indexOf(status);

  return (
    <div className={styles.statusBar}>
      {STEPS.map((step, i) => {
        const done    = !isCancelled && i < currentIdx;
        const current = !isCancelled && i === currentIdx;
        return (
          <div key={step} className={styles.statusStep}>
            <div className={`${styles.statusDot}
              ${done    ? styles.dotDone    : ""}
              ${current ? styles.dotCurrent : ""}
              ${isCancelled ? styles.dotCancelled : ""}
            `} />
            <span className={`${styles.statusLabel}
              ${current ? styles.labelCurrent : ""}
            `}>
              {STATUS_LABEL[step]}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`${styles.statusLine} ${done ? styles.lineDone : ""}`} />
            )}
          </div>
        );
      })}
      {isCancelled && (
        <div className={styles.cancelledBadge}>❌ Скасовано</div>
      )}
    </div>
  );
}