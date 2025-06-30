import apiClient from '@/services/api';
import ApiHelper from '@/lib/apiHelper';
import { Article } from '@/types/article';

interface ApiConfig {
  params?: Record<string, unknown>;
  paramsSerializer?: (params: Record<string, unknown>) => string;
  headers?: Record<string, string>;
}

// DTO for API responses (adjusted to match your real API)
interface ArticleApiDto {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author?: {
    id: number;
    name: string;
    email?: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  created_at?: string;
  updated_at?: string;
  average_rating?: number | string | null;
  visibility_days?: {
    id: number;
    article_id: number;
    day_of_week: number;
    created_at: string;
    updated_at: string;
  }[];
}

// Transform API DTO to internal Article type
const transformArticle = (apiData: ArticleApiDto): Article => ({
  id: apiData.id,
  title: apiData.title,
  content: apiData.content,
  author_id: apiData.author_id,
  visibility_days: Array.isArray(apiData.visibility_days)
    ? apiData.visibility_days.map(v => ({ day_of_week: v.day_of_week }))
    : [],
  author: apiData.author || { id: 0, name: 'Unknown' },
  average_rating: typeof apiData.average_rating === 'string'
    ? parseFloat(apiData.average_rating)
    : apiData.average_rating ?? undefined,
});

// Generic API helper
const api = {
  get: async <T>(url: string, config?: ApiConfig): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      try {
        const data = await ApiHelper.get<T>(url, config?.params);
        return data;
      } catch {
        throw error;
      }
    }
  },
  post: async <T>(url: string, data?: object, config?: ApiConfig): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      try {
        const result = await ApiHelper.post<T>(url, data);
        return result;
      } catch {
        throw error;
      }
    }
  }
};

// API methods

export const fetchArticles = async (searchQuery = ''): Promise<Article[]> => {
  try {
    const config: ApiConfig = {
      params: {
        search: searchQuery.trim() || undefined
      },
      paramsSerializer: (params) => {
        const result = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined) result.append(key, String(value));
        }
        return result.toString();
      }
    };

    const response = await api.get<{ data: ArticleApiDto[] }>('/posts', config);
    return response.data.map(transformArticle);
  } catch (error) {
    console.error('[API] Error fetching articles:', error);
    throw error;
  }
};

export const fetchUserArticles = async (): Promise<Article[]> => {
  try {
    const response = await api.get<{ data: ArticleApiDto[] }>('/my-posts');
    return response.data.map(transformArticle);
  } catch (error) {
    console.error('[API] Error fetching user articles:', error);
    throw error;
  }
};

export const getArticleById = async (id: string): Promise<Article> => {
  try {
    const response = await api.get<{ data: ArticleApiDto }>(`/articles/${id}`);
    return transformArticle(response.data);
  } catch (error) {
    console.error(`[API] Error fetching article ${id}:`, error);
    throw error;
  }
};

export const createArticle = async (data: {
  title: string;
  content: string;
  visible_days?: number[];
}): Promise<Article> => {
  try {
    const response = await api.post<{ data: ArticleApiDto }>('/articles', data);
    return transformArticle(response.data);
  } catch (error) {
    console.error('[API] Error creating article:', error);
    throw error;
  }
};

export const rateArticle = async (articleId: string, rating: number): Promise<void> => {
  try {
    await api.post<void>(`/articles/${articleId}/rate`, { rating });
  } catch (error) {
    console.error(`[API] Error rating article ${articleId}:`, error);
    throw error;
  }
};
