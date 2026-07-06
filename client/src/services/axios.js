import axios from "axios";
import API from "../config/api";

const api = axios.create({
  baseURL: API.BASE_URL,
  withCredentials: true,
});

export default api;