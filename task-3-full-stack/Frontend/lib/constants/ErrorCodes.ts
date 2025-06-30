// /src/lib/constants/errorCodes.ts
export const ERRORS = {
    // HTTP Status Codes
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  
    // Business Errors (match your Laravel codes)
    INVALID_CREDENTIALS: 1001,
    VALIDATION_ERROR: 1002,
    // Add all other codes from your backend
  } as const;