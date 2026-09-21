import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const AuthCtx = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me').then(res => setUser(res.data.user)).catch(()=>{
        localStorage.removeItem('token');
      });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (e) {
      alert(e.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (e) {
      alert(e.response?.data?.message || 'Register failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
