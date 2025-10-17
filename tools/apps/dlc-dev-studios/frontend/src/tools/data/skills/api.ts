import { apiClient as api } from '@/core/api/apiClient';
import { TSkill, CreateTSkillDto, UpdateTSkillDto } from './types';

export const getSkills = () => api.get<TSkill[]>('/data/t_skill');

export const getSkill = (id: number) => api.get<TSkill>(`/data/t_skill/${id}`);

export const createSkill = (data: CreateTSkillDto) => 
  api.post<TSkill>('/data/t_skill', data);

export const updateSkill = (id: number, data: UpdateTSkillDto) => 
  api.put<TSkill>(`/data/t_skill/${id}`, data);

export const deleteSkill = (id: number) => 
  api.delete(`/data/t_skill/${id}`);
