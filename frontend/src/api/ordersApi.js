import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const ordersApi = {
  getAll:       (params) => axios.get('/orders', { params }),
  updateStatus: (id, status) => axios.patch(`/orders/${id}/status`, { status }),
  create:       (data)   => axios.post('/orders', data),
  getById:      (id)     => axios.get(`/orders/${id}`),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getOrder:      (orderId) => api.get(`/orders/${orderId}`),
  deleteOrder:   (orderId) => api.delete(`/orders/${orderId}`),
};
