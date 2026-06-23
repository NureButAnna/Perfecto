import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const checkoutApi = {
  createCheckout: (data) => api.post("/checkout", data),
};

export const dryCleanersApi = {
  getAll:    ()     => api.get("/dry_cleaners/"),
  getByCity: (city) => api.get(`/dry_cleaners/city/${city}`),
};