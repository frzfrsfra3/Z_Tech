'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp?: number;
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}

export default function Header() {
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const validToken = token && !isTokenExpired(token);
    setIsLoggedIn(!!user && !!validToken);
  }, [user]);

  return (
    <header className="w-full bg-white shadow mb-4">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex space-x-6">
          <Link href="/posts" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
            Explore Articles
          </Link>

          {isLoggedIn && (
            <Link href="/my-posts" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              My Articles
            </Link>
          )}

          {!isLoggedIn && (
            <Link href="/register" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
              Register
            </Link>
          )}
       {!isLoggedIn && (
          <Link href="/login" className="text-lg font-semibold text-gray-700 hover:text-blue-600">
            Login
          </Link>
       )}
        </div>
      </nav>
    </header>
  );
}
