import { apiClient } from '@/core/api/apiClient';
import { unwrapResponse } from '@/core/api/utils';
import { ApiSuccessResponse } from '@/core/api/types';
import { CreateTSkillDto, SkillListMeta, SkillListParams, TSkill, UpdateTSkillDto } from './types';

const toQuery = (params: SkillListParams) => ({
  limit: params.pageSize,
  offset: (params.page - 1) * params.pageSize,
  search: params.search || undefined,
});

export async function fetchSkills(params: SkillListParams) {
  const response = await apiClient.get<ApiSuccessResponse<TSkill[], SkillListMeta>>('/data/t_skill', {
    params: toQuery(params),
  });
  return unwrapResponse(response);
}

export async function fetchSkill(id: number) {
  const response = await apiClient.get<ApiSuccessResponse<TSkill>>(`/data/t_skill/${id}`);
  return unwrapResponse(response);
}

export async function createSkill(payload: CreateTSkillDto) {
  const response = await apiClient.post<ApiSuccessResponse<TSkill>>('/data/t_skill', payload);
  return unwrapResponse(response);
}

export async function updateSkill(id: number, payload: UpdateTSkillDto) {
  const response = await apiClient.put<ApiSuccessResponse<TSkill>>(`/data/t_skill/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteSkill(id: number) {
  const response = await apiClient.delete<ApiSuccessResponse<boolean>>(`/data/t_skill/${id}`);
  return unwrapResponse(response);
}
