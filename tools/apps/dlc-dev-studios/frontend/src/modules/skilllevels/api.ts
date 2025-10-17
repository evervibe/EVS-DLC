import { apiClient } from '@/core/api/apiClient';
import { unwrapResponse } from '@/core/api/utils';
import { ApiSuccessResponse } from '@/core/api/types';
import {
  CreateTSkillLevelDto,
  SkillLevelListMeta,
  SkillLevelListParams,
  TSkillLevel,
  UpdateTSkillLevelDto,
} from './types';

const toQuery = (params: SkillLevelListParams) => ({
  limit: params.pageSize,
  offset: (params.page - 1) * params.pageSize,
  search: params.search || undefined,
  skillId: params.skillId || undefined,
});

export async function fetchSkillLevels(params: SkillLevelListParams) {
  const response = await apiClient.get<ApiSuccessResponse<TSkillLevel[], SkillLevelListMeta>>('/data/t_skilllevel', {
    params: toQuery(params),
  });
  return unwrapResponse(response);
}

export async function fetchSkillLevel(id: number) {
  const response = await apiClient.get<ApiSuccessResponse<TSkillLevel>>(`/data/t_skilllevel/${id}`);
  return unwrapResponse(response);
}

export async function createSkillLevel(payload: CreateTSkillLevelDto) {
  const response = await apiClient.post<ApiSuccessResponse<TSkillLevel>>('/data/t_skilllevel', payload);
  return unwrapResponse(response);
}

export async function updateSkillLevel(id: number, payload: UpdateTSkillLevelDto) {
  const response = await apiClient.put<ApiSuccessResponse<TSkillLevel>>(`/data/t_skilllevel/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteSkillLevel(id: number) {
  const response = await apiClient.delete<ApiSuccessResponse<boolean>>(`/data/t_skilllevel/${id}`);
  return unwrapResponse(response);
}
