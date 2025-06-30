'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: ReactNode;
}

interface JwtPayload {
  exp?: number; // expiration time in seconds since epoch
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return false; // treat tokens without exp as valid
    }

    const exp = Number(decoded.exp);
    if (isNaN(exp)) {
      return true; // treat invalid exp as expired
    }

    const now = Date.now() / 1000;
    return exp < now;
  } catch {
    return true; // invalid token treated as expired
  }
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem('token');

      if (!user || !token || isTokenExpired(token)) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
