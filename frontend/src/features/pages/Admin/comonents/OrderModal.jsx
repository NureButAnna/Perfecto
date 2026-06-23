import { useState, useEffect } from "react";
import styles from "../Admin.module.css";
import { adminApi } from "../../../../api/adminApi";
import {
  STATUS_CYCLE,
  STATUS_LABEL,
  STEP_ICON,
  getNextStatus,
} from "../../../../data/orderStatus";

const DELIVERY_LABEL = {
  courier: "🚴 Кур'єр",
  nova_poshta: "📦 Нова Пошта",
};

const STATUS_UA = {
  new: "Нове",
  accepted: "Прийнято",
  progress: "В процесі",
  ready: "Готово",
  done: "Виконано",
  cancelled: "Скасовано",
};

export default function OrderModal({ order, onClose, onAdvance, onCancel, onAssignCourier }) {
  const [couriers, setCouriers] = useState([]);
  const [chosenCourier, setChosenCourier] = useState(order.delivery?.user_id ?? null);
  const [courierOpen, setCourierOpen] = useState(false);

  const deliveryType = order.delivery?.delivery_type;
  const isClosed = order.status === "done" || order.status === "cancelled";
  const nextStatus = getNextStatus(order.status);
  const si = STATUS_CYCLE.indexOf(order.status);
  const needsCourier = deliveryType === "courier" && !chosenCourier &&
    (order.status === "accepted" || order.status === "progress");

  useEffect(() => {
    if (deliveryType !== "courier" || isClosed) return;
    adminApi.getCouriersForOrder(order.id)
      .then((r) => setCouriers(r.data))
      .catch(console.error);
  }, [order.id, deliveryType, isClosed]);

  if (!order) return null;

  const chosenCourierObj = couriers.find((c) => c.id === chosenCourier);

  function handleAdvance() {
    if (needsCourier) {
      alert("Призначте кур'єра перед зміною статусу.");
      return;
    }
    onAdvance(order.id, nextStatus);
  }

  function handleCourierSelect(c) {
    setChosenCourier(c.id);
    setCourierOpen(false);
    onAssignCourier(order.id, c.id);
  }

  function handleCancel() {
    if (!window.confirm(`Скасувати замовлення #${order.id}?`)) return;
    onCancel(order.id);
  }

  const clientName = order.user
    ? `${order.user.surname ?? ""} ${order.user.name ?? ""}`.trim()
    : "—";

  const servicesList = order.order_services?.length
    ? order.order_services.map((s) => s.service?.name ?? "—").join(", ")
    : "—";

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.modalHead}>
          <span className={styles.modalTitle}>Замовлення #{order.id}</span>
          <button className={styles.iconBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Клієнт</span>
              <span className={styles.fieldValue}>{clientName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Вартість</span>
              <span className={`${styles.fieldValue} ${styles.fieldValueAccent}`}>
                ₴{order.total_cost}
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Послуги</span>
            <span className={styles.fieldValue}>{servicesList}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Доставка</span>
            <span className={styles.fieldValue}>
              {DELIVERY_LABEL[deliveryType] ?? deliveryType ?? "—"}
              {deliveryType === "courier" && order.delivery?.city && ` · ${order.delivery.city}`}
              {deliveryType === "nova_poshta" && order.delivery?.nova_poshta_branch &&
                ` · відділення ${order.delivery.nova_poshta_branch}`}
            </span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Статус</span>
            <span className={styles.fieldValue}>{STATUS_UA[order.status] ?? order.status}</span>
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Прогрес</span>
            <div className={styles.timeline}>
              {STATUS_CYCLE.map((s, i) => {
                let stepClass = styles.timelineStepTodo;
                let icon = STEP_ICON.todo;
                if (order.status === "cancelled") {
                  if (i < si) { stepClass = styles.timelineStepDone; icon = STEP_ICON.done; }
                } else {
                  if (i < si)        { stepClass = styles.timelineStepDone;    icon = STEP_ICON.done;    }
                  else if (i === si) { stepClass = styles.timelineStepCurrent; icon = STEP_ICON.current; }
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

          {order.comment && (
            <div className={styles.warnBox}>
              <span>⚠️</span>
              <span>{order.comment}</span>
            </div>
          )}

          {deliveryType === "courier" && !isClosed && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Призначити кур'єра</span>
              <div className={styles.dropdownWrap}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnGhost} ${styles.dropdownTrigger}`}
                  onClick={() => setCourierOpen((o) => !o)}
                >
                  {courierOpen ? "▲" : "▼"} Оберіть кур'єра
                </button>

                {courierOpen && (
                  <div className={styles.dropdownList}>
                    {couriers.length === 0 && (
                      <div className={styles.dropdownItem} style={{ color: "var(--color-muted)" }}>
                        Немає доступних кур'єрів
                      </div>
                    )}
                    {couriers.map((c) => (
                      <div
                        key={c.id}
                        className={`${styles.dropdownItem} ${chosenCourier === c.id ? styles.dropdownItemActive : ""}`}
                        onClick={() => handleCourierSelect(c)}
                      >
                        {c.surname} {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {deliveryType === "courier" && !isClosed && chosenCourierObj && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Кур'єр</span>
              <span className={styles.fieldValue}>
                {chosenCourierObj.surname} {chosenCourierObj.name}
              </span>
            </div>
          )}

          {isClosed && deliveryType === "courier" && chosenCourierObj && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Кур'єр</span>
              <span className={styles.fieldValue}>
                {chosenCourierObj.surname} {chosenCourierObj.name}
              </span>
            </div>
          )}
        </div>

        {/* Підвал */}
        <div className={styles.modalFoot}>
          <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onClose}>
            Закрити
          </button>

          {order.status === "new" && (
            <button className={`${styles.btn} ${styles.btnTeal}`} onClick={handleAdvance}>
              Прийняти
            </button>
          )}
          {order.status === "accepted" && (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdvance}>
              Розпочати
            </button>
          )}
          {order.status === "progress" && (
            <button className={`${styles.btn} ${styles.btnTeal}`} onClick={handleAdvance}>
              Готово
            </button>
          )}
          {order.status === "ready" && (
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdvance}>
              Завершити
            </button>
          )}

          {!isClosed && (
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleCancel}>
              Скасувати
            </button>
          )}
        </div>
      </div>
    </div>
  );
}