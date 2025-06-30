'use client';

import { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import { useAuth } from '@/hooks/useAuth';
import { fetchArticles, fetchUserArticles } from '@/lib/api/articles';
import { useRouter } from 'next/navigation';
import type { Article } from '@/types/article';
import type { AuthUser } from '@/types/user';

interface ArticleListProps {
  articles?: Article[];
  isOwner?: boolean;
  initialArticles?: Article[];
}

export default function ArticleList({ 
  articles: propArticles, 
  isOwner = false, 
  initialArticles = [] 
}: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>(propArticles || initialArticles);
  const [loading, setLoading] = useState(!propArticles?.length && !initialArticles.length);

  // Assert user type here to help TypeScript
  const { user } = useAuth() as { user: AuthUser | null };

  const router = useRouter();
  
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = isOwner ? await fetchUserArticles() : await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!propArticles?.length && !initialArticles.length) {
      loadArticles();
    }
  }, [isOwner, initialArticles.length, propArticles]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-white rounded-lg shadow animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
        {isOwner ? "You have no articles yet." : "No articles found."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => {
        const parsedVisibilityDays = typeof article.visibility_days === 'string' 
          ? JSON.parse(article.visibility_days) 
          : article.visibility_days;

        return (
          <ArticleCard
            key={article.id}
            article={{
              ...article,
              visibility_days: parsedVisibilityDays
            }}
            isOwner={
              isOwner &&
              user != null &&
              user.id != null &&
              user.id.toString() === article.author.id.toString()
            }
          />
        );
      })}
    </div>
  );
}
