import { api } from '@/api/client';
import { TSkillLevel, CreateTSkillLevelDto, UpdateTSkillLevelDto } from './types';

export const getSkillLevels = () => api.get<TSkillLevel[]>('/data/t_skilllevel');

export const getSkillLevel = (id: number) => api.get<TSkillLevel>(`/data/t_skilllevel/${id}`);

export const createSkillLevel = (data: CreateTSkillLevelDto) => 
  api.post<TSkillLevel>('/data/t_skilllevel', data);

export const updateSkillLevel = (id: number, data: UpdateTSkillLevelDto) => 
  api.put<TSkillLevel>(`/data/t_skilllevel/${id}`, data);

export const deleteSkillLevel = (id: number) => 
  api.delete(`/data/t_skilllevel/${id}`);
