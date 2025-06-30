// types/article.ts
export interface Article {
    id: number;
    title: string;
    content: string;
    // visibility_days: string[];
    author: {
      id: number;
      name: string;
    };
    author_id: string | number;
    average_rating?: number;
    visibility_days: Array<{ day_of_week: number | string } | string>;
  }