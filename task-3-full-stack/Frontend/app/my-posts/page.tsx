'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyArticles } from '@/redux/Slices/articleSlice'; // <-- use lowercase
import { RootState, AppDispatch } from '@/redux/store';
import ArticleList from '@/components/articles/ArticleList';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Link from 'next/link';

export default function MyArticlesPage() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // No need to re-type, just use the state
  const { articles, loading, error } = useSelector((state: RootState) => state.articles);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyArticles());
    }
  }, [user, dispatch]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Articles</h1>
          <Link
            href="/add-property"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Create Post
          </Link>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && <ArticleList articles={articles} isOwner={true} />}
      </div>
    </ProtectedRoute>
  );
}
