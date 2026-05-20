import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user || res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { email: identifier, password });
    localStorage.setItem('meditrust_was_logged_in', '1');
    setUser(res.data.user || res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem('meditrust_was_logged_in');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, isAdmin, isAgent, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
