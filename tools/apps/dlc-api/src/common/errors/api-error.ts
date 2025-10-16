import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly errorCode?: string,
  ) {
    super(
      {
        statusCode,
        message,
        errorCode: errorCode || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  static badRequest(message: string, errorCode?: string): ApiError {
    return new ApiError(message, HttpStatus.BAD_REQUEST, errorCode || 'BAD_REQUEST');
  }

  static unauthorized(message: string = 'Unauthorized', errorCode?: string): ApiError {
    return new ApiError(message, HttpStatus.UNAUTHORIZED, errorCode || 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Forbidden', errorCode?: string): ApiError {
    return new ApiError(message, HttpStatus.FORBIDDEN, errorCode || 'FORBIDDEN');
  }

  static notFound(message: string = 'Resource not found', errorCode?: string): ApiError {
    return new ApiError(message, HttpStatus.NOT_FOUND, errorCode || 'NOT_FOUND');
  }

  static conflict(message: string, errorCode?: string): ApiError {
    return new ApiError(message, HttpStatus.CONFLICT, errorCode || 'CONFLICT');
  }

  static internal(message: string = 'Internal server error', errorCode?: string): ApiError {
    return new ApiError(message, HttpStatus.INTERNAL_SERVER_ERROR, errorCode || 'INTERNAL_ERROR');
  }
}
