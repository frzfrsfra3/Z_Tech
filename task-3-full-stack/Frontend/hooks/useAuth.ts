'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/services/api';
import type { AuthUser } from '@/types/user';
import type { LoginCredentials } from '@/types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/login', credentials);
    localStorage.setItem('token', response.data.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    setUser(response.data.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      // handle error
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
};