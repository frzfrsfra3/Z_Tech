// /src/components/common/SearchBar.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import debounce from 'lodash.debounce';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  // Initialize from URL on mount
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Create debounced function with useMemo
  const debouncedSearch = useMemo(() => {
    return debounce((searchQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
  }, [pathname, router, searchParams]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Cleanup debounce
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  return (
    <div className="relative mb-6 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search articles..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}