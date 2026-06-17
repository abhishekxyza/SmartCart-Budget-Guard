import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach auth token if present in localStorage
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("sb_access_token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
