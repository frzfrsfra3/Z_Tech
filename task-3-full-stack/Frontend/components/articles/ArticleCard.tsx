'use client';

import Link from 'next/link';
import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';
import { isTodayVisible } from '@/lib/utils/date';
import type { Article } from '@/types/article';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ArticleCardProps {
  article: Article;
  isOwner?: boolean;
}

export default function ArticleCard({ article, isOwner = false }: ArticleCardProps) {
  const visibleDays = article.visibility_days
    .map(day => {
      if (typeof day === 'string') {
        // If day is string, assume it's a day name and return it directly
        return day;
      }
      if (typeof day === 'object' && day !== null && 'day_of_week' in day) {
        const dayIndex = typeof day.day_of_week === 'number' ? day.day_of_week : parseInt(day.day_of_week as string, 10);
        return dayNames[dayIndex] || 'Unknown';
      }
      return 'Unknown';
    })
    .join(', ');

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <Link href={`/posts/${article.id}`}>
        <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
          <Image
            src="/photo-JgOeRuGD_Y4-800x400.jpg"
            alt={article.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          {!isTodayVisible(article.visibility_days) && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Not visible today
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-center mb-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <StarIcon
            key={value}
            style={{
              color: value <= Math.round(article.average_rating || 0) ? '#facc15' : '#e5e7eb',
              fontSize: '1rem',
            }}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {isNaN(Number(article.average_rating)) ? '0' : Number(article.average_rating).toFixed(1)}
        </span>
      </div>

      <Link href={`/posts/${article.id}`}>
        <h2 className="text-lg font-medium text-gray-800 hover:underline">{article.title}</h2>
      </Link>

      <p className="text-sm text-gray-600 mt-1 flex-1">
        {article.content.substring(0, 100)}...
      </p>

      <div className="mt-4 text-sm text-gray-500">
        <p>By {article.author.name}</p>
        <p>Visible on: {visibleDays || 'No visibility days set'}</p>
      </div>
    </div>
  );
}
