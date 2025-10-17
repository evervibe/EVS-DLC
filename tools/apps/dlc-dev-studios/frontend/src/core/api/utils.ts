import { AxiosResponse } from 'axios';
import { ApiResponse, ApiSuccessResponse } from './types';

export function unwrapResponse<TData, TMeta = Record<string, unknown> | undefined>(
  response: AxiosResponse<ApiResponse<TData, TMeta>>,
): ApiSuccessResponse<TData, TMeta> {
  const payload = response.data;

  if (!payload.success) {
    const error = new Error(payload.message);
    (error as any).code = payload.errorCode;
    throw error;
  }

  return payload;
}
