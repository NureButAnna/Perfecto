export function isActive(status) {
  if (typeof status === "boolean") return status;
  return status === "active" || status === true || status === 1;
}