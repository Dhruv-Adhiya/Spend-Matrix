import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api', // Proxied via Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Dispatch a custom event so the AuthContext can pick it up and update state
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    // Global generic error toasts for unhandled edge cases
    if (!error.response) {
      // Network errors (API down, DNS failed, CORS blocked)
      toast.error('Network error. Please check your connection or try again later.', { id: 'network-err' });
    } else if (error.response.status >= 500) {
      // Server crashes
      toast.error('Internal Server Error. Our team has been notified.', { id: 'server-err' });
    }
    
    // We intentionally let individual requests catch and handle 400/403/404 errors as they often have specific UI responses.
    
    return Promise.reject(error);
  }
);

export default api;
