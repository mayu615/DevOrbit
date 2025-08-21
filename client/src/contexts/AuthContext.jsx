import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load logged-in user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fetchedUser = res.data.data?.user || res.data.user || null;
        setUser(fetchedUser);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    const token = res.data.data?.token || res.data.token;
    const fetchedUser = res.data.data?.user || res.data.user;

    if (!token) throw new Error('Login failed: token not received');

    localStorage.setItem('token', token);
    setUser(fetchedUser || null);
    return fetchedUser;
  };

  const register = async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, formData);
    const token = res.data.data?.token || res.data.token;
    const fetchedUser = res.data.data?.user || res.data.user;

    if (!token) throw new Error('Registration failed: token not received');

    localStorage.setItem('token', token);
    setUser(fetchedUser || null);
    return fetchedUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
