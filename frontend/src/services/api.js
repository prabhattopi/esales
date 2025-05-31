// client/src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api', // Fallback if .env is not setf
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;