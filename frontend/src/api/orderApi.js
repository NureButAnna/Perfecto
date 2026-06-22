import axios from "axios";

const api = axios.create({ baseURL: "http://127.0.0.1:8000" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const ordersApi = {
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getOrder:      (orderId) => api.get(`/orders/${orderId}`),
  deleteOrder:   (orderId) => api.delete(`/orders/${orderId}`),
};