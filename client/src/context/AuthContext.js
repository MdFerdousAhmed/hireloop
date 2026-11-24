'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';



const AuthContext = createContext({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  switchRole: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('hireloop_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      const { token, user } = res;
      localStorage.setItem('hireloop_token', token);
      localStorage.setItem('hireloop_user', JSON.stringify(user));
      setUser(user);
    } catch (e) {
      console.error('Login failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      const { token, user } = res;
      localStorage.setItem('hireloop_token', token);
      localStorage.setItem('hireloop_user', JSON.stringify(user));
      setUser(user);
    } catch (e) {
      console.error('Register failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hireloop_user');
  };

  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      const nextUser = DEMO_USERS[newRole];
      setUser(nextUser);
      localStorage.setItem('hireloop_user', JSON.stringify(nextUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
