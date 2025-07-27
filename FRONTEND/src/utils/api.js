// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  
  withCredentials: true, // this sends cookies
});

export default api;