export const STATUS_CYCLE = ["new", "accepted", "progress", "ready", "done"];

export const STATUS_LABEL = {
  new:       "Оформлено",
  accepted:  "Прийнято",
  progress:  "В процесі",
  ready:     "Готово",
  done:      "Виконано",
  cancelled: "Скасовано",
};

export const STEP_ICON = {
  done:    "✅",
  current: "🔵",
  todo:    "⚪",
  cancel:  "❌",
};

export function getNextStatus(current) {
  const idx = STATUS_CYCLE.indexOf(current);
  return idx >= 0 && idx < STATUS_CYCLE.length - 1
    ? STATUS_CYCLE[idx + 1]
    : null;
}

export function canAdvance(order) {
  return (
    order.status !== "done" &&
    order.status !== "cancelled" &&
    getNextStatus(order.status) !== null
  );
}