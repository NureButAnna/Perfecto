import { useState } from "react";
import styles from "../Admin.module.css";
import {
  STATUS_CYCLE,
  STATUS_LABEL,
  STEP_ICON,
  getNextStatus,
} from "../../../../data/orderStatus";


export default function OrderModal({ order, couriers, onClose, onAdvance, onCancel, onAssignCourier }) {
  const [chosenCourier, setChosenCourier] = useState(order.courier_id ?? null);

  if (!order) return null;

  const si = STATUS_CYCLE.indexOf(order.status);
  const nextStatus = getNextStatus(order.status);
  const needsCourier = (order.status === "accepted" || order.status === "progress") && !chosenCourier;

  function handleAdvance() {
    if (needsCourier) {
      alert("Призначте кур'єра перед зміною статусу.");
      return;
    }
    onAdvance(order.id, nextStatus);
  }

    function handleCourierSelect(courierId) {
      if (!courierId) return;

      const id = order.id ?? order.order_id;

      if (!id) {
        console.error("Order ID missing", order);
        return;
      }

      setChosenCourier(courierId);
      onAssignCourier(id, courierId);
    }

  function handleCancel() {
    if (!window.confirm(`Скасувати замовлення #${order.id}?`)) return;
    onCancel(order.id);
  }

  const isClosed = order.status === "done" || order.status === "cancelled";

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* ── Заголовок ── */}
        <div className={styles.modalHead}>
          <span style={{ fontSize: 20 }}>📋</span>
          <span className={styles.modalTitle}>
            Замовлення #{order.id}
          </span>
          <button className={styles.iconBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── Тіло ── */}
        <div className={styles.modalBody}>

          {/* Основні поля */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Клієнт</span>
              <span className={styles.fieldValue}>{order.client_name}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Вартість</span>
              <span className={`${styles.fieldValue} ${styles.fieldValueAccent}`}>
                ₴{order.total_price}
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Послуги</span>
            <span className={styles.fieldValue}>{order.items}</span>
          </div>

          {order.note && (
            <div className={styles.warnBox}>
              <span>⚠️</span>
              <span>{order.note}</span>
            </div>
          )}

          {/* Таймлайн статусів */}
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Прогрес виконання</span>
            <div className={styles.timeline}>
              {STATUS_CYCLE.map((s, i) => {
                let stepClass = styles.timelineStepTodo;
                let icon = STEP_ICON.todo;

                if (order.status === "cancelled") {
                  if (i < si) { stepClass = styles.timelineStepDone; icon = STEP_ICON.done; }
                } else {
                  if (i < si)      { stepClass = styles.timelineStepDone;    icon = STEP_ICON.done;    }
                  else if (i === si){ stepClass = styles.timelineStepCurrent; icon = STEP_ICON.current; }
                }

                return (
                  <div key={s} className={`${styles.timelineStep} ${stepClass}`}>
                    <span>{icon}</span>
                    <span>{STATUS_LABEL[s]}</span>
                  </div>
                );
              })}
              {order.status === "cancelled" && (
                <div className={`${styles.timelineStep} ${styles.timelineStepCancel}`}>
                  <span>{STEP_ICON.cancel}</span>
                  <span>Скасовано</span>
                </div>
              )}
            </div>
          </div>

          {/* Призначення кур'єра */}
          {!isClosed && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>
                {chosenCourier ? "Кур'єр призначений" : "Призначити кур'єра"}
              </span>
              <div className={styles.couriersGrid}>
                {(couriers || []).filter((c) => c.is_active).map((c) => (
                  <div
                    key={c.courier_id}
                    className={`${styles.courierCard} ${chosenCourier === c.courier_id ? styles.courierCardChosen : ""}`}
                    onClick={() => handleCourierSelect(c.courier_id)}
                  >
                    <div className={styles.courierAvatar}>
                      {c.first_name?.[0]}{c.last_name?.[0]}
                    </div>
                    <div>
                      <div className={styles.courierName}>
                        {c.first_name} {c.last_name}
                      </div>
                      <div className={styles.courierStatus}>Вільний</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isClosed && order.courier_name && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Кур'єр</span>
              <span className={styles.fieldValue}>{order.courier_name}</span>
            </div>
          )}
        </div>

        {/* ── Підвал ── */}
        <div className={styles.modalFoot}>
          <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onClose}>
            Закрити
          </button>

          {/* Кнопки переходу статусу */}
          {order.status === "new" && (
            <button className={`${styles.btn} ${styles.btnTeal}`} onClick={handleAdvance}>
              ✔ Прийняти замовлення
            </button>
          )}
          {order.status === "accepted" && (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdvance}>
              ▶ Розпочати виконання
            </button>
          )}
          {order.status === "progress" && (
            <button className={`${styles.btn} ${styles.btnTeal}`} onClick={handleAdvance}>
              📦 Позначити готовим
            </button>
          )}
          {order.status === "ready" && (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdvance}>
              ✅ Завершити
            </button>
          )}

          {!isClosed && (
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleCancel}>
              🚫 Скасувати
            </button>
          )}
        </div>
      </div>
    </div>
  );
}