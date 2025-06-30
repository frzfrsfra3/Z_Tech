'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getArticleById } from '@/lib/api/articles';
import RatingStars from '@/components/articles/RatingStars';
import StarIcon from '@mui/icons-material/Star';
import Image from 'next/image';
import '@/styles/post_details/style.css';
import '@/styles/post_details/bootstrap.min.css';
import '@/styles/post_details/details.css';
import type { Article } from '@/types/article';
import type { AuthUser } from '@/types/user';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

// Type guard to check if a string is a valid day name
function isDayName(value: string): value is typeof dayNames[number] {
  return (dayNames as readonly string[]).includes(value);
}

export default function ArticleDetailPage() {
  const params = useParams();
  const { user } = useAuth() as { user: AuthUser | null };
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const parseVisibilityDays = (days: Article['visibility_days']) => {
    if (!days) return [];
    if (Array.isArray(days)) {
      return days
        .map(day => {
          if (typeof day === 'object' && day !== null && 'day_of_week' in day) {
            return typeof day.day_of_week === 'number' ? day.day_of_week : null;
          }
          if (typeof day === 'string' && isDayName(day)) {
            const index = dayNames.indexOf(day);
            return index >= 0 ? index : null;
          }
          return null;
        })
        .filter((day): day is number => day !== null);
    }
    if (typeof days === 'string') {
      try {
        const parsed = JSON.parse(days);
        return Array.isArray(parsed)
          ? parsed
              .map((day: { day_of_week?: number }) => day?.day_of_week)
              .filter((day): day is number => typeof day === 'number')
          : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    if (id) {
      getArticleById(id)
        .then((data) => setArticle(data))
        .catch(() => setArticle(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Article not found.</p>
      </div>
    );
  }

  const isAuthor = user && article.author && user.id.toString() === article.author.id.toString();
  const visibleDays = parseVisibilityDays(article.visibility_days);

  return (
    <div className="user-card">
      <div
        className="card-cover"
        style={{
          backgroundImage: `url('/photo-JgOeRuGD_Y4-800x400.jpg')`,
        }}
      >
        <div className="avatar-wrapper">
          <div className="avatar">
            <Image
              src="/research-banner.jpg"
              alt={article.author.name}
              width={100}
              height={100}
              className="avatar-img"
            />
          </div>
        </div>
      </div>

      <div className="card-body">
        <h2 className="card-name">{article.title}</h2>
        <p className="card-info">By: {article.author.name}</p>
        <p className="card-info">{article.content}</p>

        <div className="ratings-section mt-4">
          <strong>Average Rating:</strong>{' '}
          {isNaN(Number(article.average_rating))
            ? '0'
            : Number(article.average_rating).toFixed(1)}
          <div className="star-rating mt-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <StarIcon
                key={value}
                style={{
                  color:
                    value <= Number(article.average_rating)
                      ? '#ffc107'
                      : '#e4e5e9',
                  fontSize: '1.5rem',
                }}
              />
            ))}
          </div>
        </div>

        <div className="courses-section mt-4">
          <h3>Visibility Days</h3>
          <div className="hashtags">
            {visibleDays.length > 0 ? (
              visibleDays.map((dayNumber, index) => (
                <span key={index} className="hashtag">
                  #{dayNames[dayNumber]}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No visibility days set</span>
            )}
          </div>
        </div>

        {!isAuthor && user && (
          <div className="mt-4">
            <RatingStars articleId={article.id.toString()} />
          </div>
        )}
      </div>
    </div>
  );
}
