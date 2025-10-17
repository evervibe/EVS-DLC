import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, getItem, createItem, updateItem, deleteItem } from './api';
import { CreateTItemDto, UpdateTItemDto } from './types';

export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const response = await getItems();
      return response.data;
    },
  });
};

export const useItem = (id: number) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: async () => {
      const response = await getItem(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTItemDto) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTItemDto }) => 
      updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
