import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ff-arena-server.onrender.com",
  withCredentials: true, // ✅ গুরুত্বপূর্ণ
});

export default api;