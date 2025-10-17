export interface ApiSuccessResponse<TData, TMeta = Record<string, unknown> | undefined> {
  success: true;
  data: TData;
  message?: string;
  meta?: TMeta;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path?: string;
}

export type ApiResponse<TData, TMeta = Record<string, unknown> | undefined> =
  | ApiSuccessResponse<TData, TMeta>
  | ApiErrorResponse;
