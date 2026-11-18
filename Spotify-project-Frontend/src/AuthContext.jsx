import { createContext, useContext, useState } from 'react';
import api from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // The JWT lives in an httpOnly-style cookie that JS can't read, and your backend has
  // no "who am I" endpoint, so we remember the user object the server sent us.
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  function save(u) {
    setUser(u);
    if (u) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
  }

  async function login(form) {
    const { data } = await api.post('/auth/login', form);
    save(data.user);
    return data.user;
  }

  async function register(form) {
    const { data } = await api.post('/auth/register', form);
    save(data.user);
    return data.user;
  }

  async function logout() {
    await api.post('/auth/logout');
    save(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
