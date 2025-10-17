import { apiClient as api } from '@/core/api/apiClient';
import { TString, CreateTStringDto, UpdateTStringDto } from './types';

export const getStrings = () => api.get<TString[]>('/data/t_string');

export const getString = (id: number) => api.get<TString>(`/data/t_string/${id}`);

export const createString = (data: CreateTStringDto) => 
  api.post<TString>('/data/t_string', data);

export const updateString = (id: number, data: UpdateTStringDto) => 
  api.put<TString>(`/data/t_string/${id}`, data);

export const deleteString = (id: number) => 
  api.delete(`/data/t_string/${id}`);
