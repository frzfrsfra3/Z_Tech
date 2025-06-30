import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '@/services/api';
import { AxiosError } from 'axios';
import { Article } from '@/types/article';

interface ArticleState {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticleState = {
  articles: [],
  loading: false,
  error: null,
};

// ✅ Fetch articles
export const fetchArticles = createAsyncThunk<Article[], void, { rejectValue: string }>(
  'articles/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ data: Article[] }>('/posts');
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch articles.');
    }
  }
);
//  ✅  get my articles
export const fetchMyArticles = createAsyncThunk(
    'articles/fetchMyArticles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<{ data: Article[] }>('/my-posts');
            return response.data.data;
          } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            return rejectWithValue(err.response?.data?.message ?? 'Failed to fetch articles.');
          }
    }
  );

// ✅ Delete article
export const deleteArticle = createAsyncThunk<number, number, { rejectValue: string }>(
  'articles/delete',
  async (articleId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/articles/${articleId}`);
      return articleId;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message ?? 'Failed to delete article.');
    }
  }
);

// ✅ Create article
export const createArticle = createAsyncThunk<
  Article,
  { title: string; content: string; visible_days?: number[] },
  { rejectValue: string }
>(
  'articles/create',
  async (newArticleData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ data: Article }>('/articles', newArticleData);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message ?? 'Failed to create article.');
    }
  }
);

// ✅ Update article
export const updateArticle = createAsyncThunk<
  Article,
  { articleId: number; updatedData: Partial<Article> },
  { rejectValue: string }
>(
  'articles/update',
  async ({ articleId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{ data: Article }>(`/articles/${articleId}`, updatedData);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message ?? 'Failed to update article.');
    }
  }
);

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        // createArticle
        .addCase(createArticle.fulfilled, (state, action) => {
            state.articles.unshift(action.payload); // Add to the top of the list
        })
        .addCase(createArticle.rejected, (state, action) => {
            state.error = action.payload ?? 'Failed to create article.';
        })
        .addCase(fetchMyArticles.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchMyArticles.fulfilled, (state, action) => {
            state.loading = false;
            state.articles = action.payload;
          })
          .addCase(fetchMyArticles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
      // fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load articles.';
      })

      // deleteArticle
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete article.';
      })

      // updateArticle
      .addCase(updateArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update article.';
      });
  },
});

export default articleSlice.reducer;
