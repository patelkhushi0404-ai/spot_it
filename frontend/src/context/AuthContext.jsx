import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const { data } = await API.get('/profile');
          setUser(data.user);
        } catch (error) {
          localStorage.clear();
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const login = async (formData) => {
    const { data } = await API.post('/auth/login', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  };

 const logout = async () => {
  try { await API.post('/auth/logout'); } catch (error) {}
  localStorage.clear();
  setUser(null);
  window.location.href = '/';
};

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;