import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = sessionStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (phone, password) => {
    try {
      const res = await api.post('/auth/login', { phone, password });
      const { user: userData, accessToken } = res.data.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', accessToken);
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.warn("API Login failed, trying demo mode fallback:", error.message);
      
      // Demo Mode Fallback
      if (phone === '9876543210' && password === 'password123') {
        const mockUser = { id: 'demo-1', name: 'Demo Patient', role: 'patient', phone };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('token', 'demo_token');
        sessionStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Try demo: 9876543210 / password123' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
