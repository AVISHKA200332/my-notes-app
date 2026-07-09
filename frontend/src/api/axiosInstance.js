import axios from 'axios';

/**
 * In development:  VITE_API_BASE_URL = http://localhost:5000
 *                  Vite proxy forwards /api/* to the backend
 *
 * In production:   VITE_API_BASE_URL = https://your-backend-name.onrender.com
 *                  Requests go directly to the Render backend service
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'; // fallback to Vite proxy

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
