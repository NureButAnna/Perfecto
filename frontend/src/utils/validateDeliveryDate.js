export function validateDeliveryDate(value) {
  if (!value) {
    return "";
  }

  const selected = new Date(value);
  const now = new Date();

  if (selected < now) {
    return "Дата не може бути в минулому";
  }

  const hour = selected.getHours();

  if (hour < 8 || hour >= 20) {
    return "Доставка працює з 08:00 до 20:00";
  }

  return "";
}