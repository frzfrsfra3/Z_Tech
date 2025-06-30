// /src/lib/apiHelper.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  data?: unknown;
  errors?: Record<string, unknown> | unknown[];
}

interface UserData {
  token: string;
  // Add other user properties as needed
}

class ApiHelper {
  private static getToken(): string {
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      const user: UserData = JSON.parse(localStorage.getItem('user')!);
      return `Bearer ${user.token}`;
    }
    return '';
  }

  private static handleUnauthorized(): never {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/login';
    }
    throw new Error('Unauthorized - Redirecting to login');
  }

  private static extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.message) return axiosError.message;
    if (axiosError.response?.data?.message) return axiosError.response.data.message;
    if (axiosError.response?.data) return JSON.stringify(axiosError.response.data);
    
    return 'An unknown error occurred';
  }

  private static async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        ...config,
        headers: {
          ...config.headers,
          Authorization: config.headers?.Authorization || this.getToken(),
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        this.handleUnauthorized();
      }

      const message = this.extractErrorMessage(axiosError);
      throw new Error(message);
    }
  }

  static async get<T>(url: string, params?: object, requiresAuth = true): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      headers: {
        Authorization: requiresAuth ? this.getToken() : undefined,
      },
    });
  }

  static async post<T>(url: string, data?: unknown, requiresAuth = true): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      headers: {
        Authorization: requiresAuth ? this.getToken() : undefined,
      },
    });
  }

  static async put<T>(url: string, data?: unknown, requiresAuth = true): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      headers: {
        Authorization: requiresAuth ? this.getToken() : undefined,
      },
    });
  }

  static async delete<T>(url: string, data?: unknown, requiresAuth = true): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      data,
      headers: {
        Authorization: requiresAuth ? this.getToken() : undefined,
      },
    });
  }
}

export default ApiHelper;