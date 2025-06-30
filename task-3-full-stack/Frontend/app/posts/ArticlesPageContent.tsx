'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchArticles } from '@/lib/api/articles';
import ArticleList from '@/components/articles/ArticleList';
import SearchBar from '@/components/common/SearchBar';
import { isTodayVisible } from '@/lib/utils/date';
import type { Article } from '@/types/article';

function parseVisibilityDays(visibilityDays: unknown): { day_of_week: number }[] {
  // If already in correct format
  if (Array.isArray(visibilityDays)) {
    return visibilityDays.filter((day): day is { day_of_week: number } => 
      typeof day === 'object' && day !== null && 'day_of_week' in day
    );
  }

  // If it's a string, try to parse it
  if (typeof visibilityDays === 'string') {
    try {
      const parsed = JSON.parse(visibilityDays);
      return Array.isArray(parsed) 
        ? parsed.filter((day): day is { day_of_week: number } => 
            typeof day === 'object' && day !== null && 'day_of_week' in day
          )
        : [];
    } catch {
      return [];
    }
  }

  // For any other case
  return [];
}

export default function ArticlesPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchArticles(searchQuery);
        const filtered = data.filter(article => 
          isTodayVisible(parseVisibilityDays(article.visibility_days))
        );
        setArticles(filtered);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Explore Today's Articles
          </h1>
          <SearchBar />
        </div>
        {isLoading ? (
          <div className="text-center py-10">Loading articles...</div>
        ) : (
          <>
            {articles.length > 0 || !searchQuery ? (
              <ArticleList initialArticles={articles} />
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}