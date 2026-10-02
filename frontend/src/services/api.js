// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://blog-platform--s41m.onrender.com/api",
  withCredentials: true,
});

// Auto attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
