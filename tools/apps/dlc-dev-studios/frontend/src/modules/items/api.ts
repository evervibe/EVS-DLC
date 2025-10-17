import { apiClient } from '@/core/api/apiClient';
import { unwrapResponse } from '@/core/api/utils';
import { ApiSuccessResponse } from '@/core/api/types';
import { CreateTItemDto, ItemListMeta, ItemListParams, TItem, UpdateTItemDto } from './types';

const toQuery = (params: ItemListParams) => ({
  limit: params.pageSize,
  offset: (params.page - 1) * params.pageSize,
  search: params.search || undefined,
});

export async function fetchItems(params: ItemListParams) {
  const response = await apiClient.get<ApiSuccessResponse<TItem[], ItemListMeta>>(
    '/data/t_item',
    { params: toQuery(params) },
  );

  return unwrapResponse(response);
}

export async function fetchItem(id: number) {
  const response = await apiClient.get<ApiSuccessResponse<TItem>>(`/data/t_item/${id}`);
  return unwrapResponse(response);
}

export async function createItem(payload: CreateTItemDto) {
  const response = await apiClient.post<ApiSuccessResponse<TItem>>('/data/t_item', payload);
  return unwrapResponse(response);
}

export async function updateItem(id: number, payload: UpdateTItemDto) {
  const response = await apiClient.put<ApiSuccessResponse<TItem>>(`/data/t_item/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteItem(id: number) {
  const response = await apiClient.delete<ApiSuccessResponse<boolean>>(`/data/t_item/${id}`);
  return unwrapResponse(response);
}
