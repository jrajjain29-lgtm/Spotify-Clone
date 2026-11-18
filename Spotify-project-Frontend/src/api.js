
import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true
});

// If cookie expires or is invalid, redirect to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      !location.pathname.startsWith('/login')
    ) {
      localStorage.removeItem('user');
      location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const errorText = (err) =>
  err.response?.data?.message || 'Could not reach the server. Is the backend running?';

export default api;
