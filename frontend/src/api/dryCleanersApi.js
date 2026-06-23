import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const dryCleanersApi = {
  async getAll() {
    const response = await api.get("/dry_cleaners/");
    return response.data;
  },
};