import { api } from '@/api/client';
import { TItem, CreateTItemDto, UpdateTItemDto } from './types';

export const getItems = () => api.get<TItem[]>('/data/t_item');

export const getItem = (id: number) => api.get<TItem>(`/data/t_item/${id}`);

export const createItem = (data: CreateTItemDto) => 
  api.post<TItem>('/data/t_item', data);

export const updateItem = (id: number, data: UpdateTItemDto) => 
  api.put<TItem>(`/data/t_item/${id}`, data);

export const deleteItem = (id: number) => 
  api.delete(`/data/t_item/${id}`);
