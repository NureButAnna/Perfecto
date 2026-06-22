import axios from "axios";

const BASE = "http://127.0.0.1:8000";

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: (email, password) => {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);
    return api.post("/auth/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },


  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/users/me"),
  updateMe: (id, data) => api.put(`/users/${id}`, data),
};