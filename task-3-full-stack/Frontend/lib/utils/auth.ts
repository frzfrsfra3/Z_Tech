// /src/lib/utils/auth.ts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Option 1: Create a custom hook
export const useRedirectToLogin = () => {
  const router = useRouter();
  
  return () => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  };
};

// Option 2: Router-independent version (for use outside components)
export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
  }
};

// Option 3: Component that handles redirect
export const LoginRedirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }, [router]);

  return null;
};