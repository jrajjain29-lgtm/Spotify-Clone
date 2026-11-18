import axios from 'axios';

// One axios instance for the whole app.
// baseURL '/api' + the Vite proxy => requests reach http://localhost:3000/api/...
// withCredentials makes the browser send/receive your JWT cookie.
const api = axios.create({ baseURL: '/api', withCredentials: true });

// If the cookie expires or is invalid, the backend answers 401: send the person to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !location.pathname.startsWith('/login')) {
      localStorage.removeItem('user');
      location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const errorText = (err) =>
  err.response?.data?.message || 'Could not reach the server. Is the backend running?';

export default api;
