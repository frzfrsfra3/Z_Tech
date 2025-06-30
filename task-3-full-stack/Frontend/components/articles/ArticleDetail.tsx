// components/articles/ArticleDetail.tsx
'use client';

import StarIcon from '@mui/icons-material/Star';

import { isTodayVisible } from '@/lib/utils/date';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Article {
  id: number;
  title: string;
  content: string;
  visibility_days: { day_of_week: number }[];
  author: {
    id: number;
    name: string;
  };
  ratings?: { rating: number }[];
  average_rating?: number;
}

export default function ArticleDetail({ article }: { article: Article }) {
  // Check if article.visibility_days exists and is an array
  const visibleDays = Array.isArray(article.visibility_days)
    ? article.visibility_days.map(day => dayNames[day.day_of_week])
    : [];
 
  const isVisibleToday = isTodayVisible(article.visibility_days);

  return (
    <div className="container py-5">
      {/* Visibility Alert */}
      {!isVisibleToday && visibleDays.length > 0 && (
        <div className="alert alert-warning mb-4">
          This article is not visible today. It's only visible on: {visibleDays.join(', ')}
        </div>
      )}

      {/* Article Header */}
      <div className="text-center mb-5">
        <h1 className="display-4">{article.title}</h1>
        <div className="d-flex justify-content-center align-items-center mt-3">
          <div className="star-rating me-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <StarIcon
                key={value}
                style={{
                  color: value <= Math.round(article.average_rating || 0) ? '#ffc107' : '#e4e5e9',
                  fontSize: '1.5rem',
                }}
              />
            ))}
            <span className="ms-2 fs-5">{article.average_rating?.toFixed(1) || 'Not rated'}</span>
          </div>
          <span className="text-muted">By {article.author.name}</span>
        </div>
        <div className="mt-2">
          <span className="badge bg-info text-dark">
            Visible on: {visibleDays.length > 0 ? visibleDays.join(', ') : 'No days specified'}
          </span>
        </div>
      </div>

    
    </div>
  );
}
