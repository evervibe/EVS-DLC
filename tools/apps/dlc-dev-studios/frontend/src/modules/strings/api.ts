import { apiClient } from '@/core/api/apiClient';
import { unwrapResponse } from '@/core/api/utils';
import { ApiSuccessResponse } from '@/core/api/types';
import { CreateTStringDto, StringListMeta, StringListParams, TString, UpdateTStringDto } from './types';

const toQuery = (params: StringListParams) => ({
  limit: params.pageSize,
  offset: (params.page - 1) * params.pageSize,
  search: params.search || undefined,
});

export async function fetchStrings(params: StringListParams) {
  const response = await apiClient.get<ApiSuccessResponse<TString[], StringListMeta>>('/data/t_string', {
    params: toQuery(params),
  });
  return unwrapResponse(response);
}

export async function fetchString(id: number) {
  const response = await apiClient.get<ApiSuccessResponse<TString>>(`/data/t_string/${id}`);
  return unwrapResponse(response);
}

export async function createString(payload: CreateTStringDto) {
  const response = await apiClient.post<ApiSuccessResponse<TString>>('/data/t_string', payload);
  return unwrapResponse(response);
}

export async function updateString(id: number, payload: UpdateTStringDto) {
  const response = await apiClient.put<ApiSuccessResponse<TString>>(`/data/t_string/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteString(id: number) {
  const response = await apiClient.delete<ApiSuccessResponse<boolean>>(`/data/t_string/${id}`);
  return unwrapResponse(response);
}
