import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const adminApi = {
  getOrders:         ()                     => api.get("/admin/orders"),
  updateOrderStatus: (orderId, status)      => api.patch(`/admin/orders/${orderId}/status?status=${status}`),
  assignCourier:     (orderId, userId)   => api.patch(`/admin/orders/${orderId}/courier?user_id=${userId}`),
  getCouriers:       ()                     => api.get("/admin/couriers"),
  getStaff:          ()                     => api.get("/admin/staff"),
  updateStaffStatus: (staffId, isActive)    => api.patch(`/admin/staff/${staffId}/status`, { is_active: isActive }),
  deleteStaff:       (staffId)              => api.delete(`/admin/staff/${staffId}`),
  getUsers:          ()                     => api.get("/admin/users"),
  updateUserStatus:  (userId, isActive)     => api.patch(`/admin/users/${userId}/status`, { is_active: isActive }),
  deleteUser:        (userId)               => api.delete(`/admin/users/${userId}`),
  exportData:        (type, { from, to }={})=> api.get(`/admin/export/${type}`, { params: { from, to }, responseType: "blob" }),
  getCouriersForOrder: (orderId)            => api.get(`/admin/orders/${orderId}/couriers`),
  getDryCleaners:      ()                   => api.get("/dry_cleaners/"),
};