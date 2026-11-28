'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

const AuthContext = createContext({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    role: (u.role || 'CANDIDATE').toUpperCase(),
  };
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function hydrateSession() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('hireloop_token') : null;
        if (token) {
          const currentUser = await api.getCurrentUser();
          if (active && currentUser) {
            const normalized = normalizeUser(currentUser);
            localStorage.setItem('hireloop_user', JSON.stringify(normalized));
            setUser(normalized);
            return;
          }
        }
        // Fallback: check if httpOnly refresh cookie is valid
        const refreshed = await api.refresh().catch(() => null);
        if (active && refreshed?.token && refreshed?.user) {
          const normalized = normalizeUser(refreshed.user);
          localStorage.setItem('hireloop_token', refreshed.token);
          localStorage.setItem('hireloop_user', JSON.stringify(normalized));
          setUser(normalized);
        } else if (active) {
          localStorage.removeItem('hireloop_token');
          localStorage.removeItem('hireloop_user');
          setUser(null);
        }
      } catch {
        if (active) {
          localStorage.removeItem('hireloop_token');
          localStorage.removeItem('hireloop_user');
          setUser(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    hydrateSession();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    const { token, user: rawUser } = res || {};
    if (!token || !rawUser) {
      throw new Error('Authentication failed: invalid server response.');
    }
    const normalized = normalizeUser(rawUser);
    localStorage.setItem('hireloop_token', token);
    localStorage.setItem('hireloop_user', JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.register(data);
    const { token, user: rawUser } = res || {};
    if (!token || !rawUser) {
      throw new Error('Registration failed: invalid server response.');
    }
    const normalized = normalizeUser(rawUser);
    localStorage.setItem('hireloop_token', token);
    localStorage.setItem('hireloop_user', JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('hireloop_token');
      localStorage.removeItem('hireloop_user');
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const updateUser = useCallback((updated) => {
    const normalized = normalizeUser(updated);
    setUser(normalized);
    if (normalized) {
      localStorage.setItem('hireloop_user', JSON.stringify(normalized));
    }
  }, []);

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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
