// /src/lib/ApiError.ts
import { ERRORS } from '@/lib/constants/ErrorCodes';
import { redirectToLogin } from '@/lib/utils/auth';

interface ErrorResponse {
  code?: number;
  message?: string;
  errors?: Record<string, unknown> | unknown[];
  status?: number;
  data?: unknown;
}

interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: ErrorResponse;
  };
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(error: unknown): ApiError {
    const axiosError = error as AxiosErrorResponse;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data || {} as ErrorResponse;
    const code = data.code || status || ERRORS.SERVER_ERROR;
    const message = data.message || axiosError.message || 'Unknown error occurred';
    const details = data.errors || axiosError.response?.data;

    // Handle 401 Unauthorized immediately
    if (code === ERRORS.UNAUTHORIZED || status === 401) {
      redirectToLogin();
    }

    return new ApiError(code, message, details);
  }

  isUnauthorized(): boolean {
    return this.code === ERRORS.UNAUTHORIZED;
  }

  isForbidden(): boolean {
    return this.code === ERRORS.FORBIDDEN;
  }

  isNotFound(): boolean {
    return this.code === ERRORS.NOT_FOUND;
  }

  // Add other helper methods as needed
}