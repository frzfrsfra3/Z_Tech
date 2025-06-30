'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArticleDetail from '@/components/articles/ArticleDetail';
import { getArticleById } from '@/lib/api/articles';
import type { Article as ApiArticle } from '@/types/article';

// Define the Article type expected by ArticleDetail component
interface ArticleForDetail extends Omit<ApiArticle, 'visibility_days'> {
  visibility_days: { day_of_week: number }[];
}

// Helper to convert day name string to day_of_week number (0 = Sunday, 6 = Saturday)
const dayNameToNumber = (day: string): number =>
  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);

// Type guard for visibility days array
function isVisibilityDayArray(arr: unknown[]): arr is { day_of_week: number }[] {
  return arr.every((item): item is { day_of_week: number } => {
    return (
      typeof item === 'object' && 
      item !== null && 
      'day_of_week' in item && 
      typeof (item as { day_of_week: unknown }).day_of_week === 'number'
    );
  });
}

export default function ArticleDetailClient() {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleForDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      setLoading(true);
      getArticleById(id)
        .then((data) => {
          let visibility_days: { day_of_week: number }[] = [];

          if (
            Array.isArray(data.visibility_days) &&
            data.visibility_days.length > 0
          ) {
            if (typeof data.visibility_days[0] === 'string') {
              // Convert string[] to { day_of_week: number }[]
              visibility_days = (data.visibility_days as string[]).map(day => ({
                day_of_week: dayNameToNumber(day),
              }));
            } else if (isVisibilityDayArray(data.visibility_days)) {
              visibility_days = data.visibility_days;
            }
          }
          
          setArticle({ ...data, visibility_days });
          setError(null);
        })
        .catch(() => {
          setError('Failed to load article.');
          setArticle(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Loading article...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>Article not found.</div>;

  return <ArticleDetail article={article} />;
}