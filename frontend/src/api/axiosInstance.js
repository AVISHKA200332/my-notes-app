import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Proxied to http://localhost:5000/api by Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
