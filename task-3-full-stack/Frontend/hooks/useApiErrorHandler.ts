// /src/hooks/useApiErrorHandler.ts
'use client';

import { useRouter } from 'next/navigation';
import { ERRORS } from '@/lib/constants/ErrorCodes';
import { ApiError } from '@/lib/ApiError';

export const useApiErrorHandler = () => {
  const router = useRouter();

  const handleError = (error: unknown) => {
    // Convert to ApiError if it isn't already
    const apiError = error instanceof ApiError ? error : ApiError.fromResponse(error);

    // Handle specific error codes
    switch (apiError.code) {
      case ERRORS.UNAUTHORIZED:
        // Already handled by ApiError.fromResponse
        break;
      case ERRORS.FORBIDDEN:
        // Redirect to forbidden page or show message
        router.push('/forbidden');
        break;
      case ERRORS.NOT_FOUND:
        router.push('/not-found');
        break;
      default:
        console.error('Unhandled API error:', apiError);
    }

    // Return the error for further handling if needed
    return apiError;
  };

  return { handleError };
};