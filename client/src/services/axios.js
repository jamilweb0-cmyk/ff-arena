import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // Cookie পাঠানোর জন্য আবশ্যক
});

export default api;