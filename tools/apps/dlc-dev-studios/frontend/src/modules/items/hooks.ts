import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createItem, deleteItem, fetchItem, fetchItems, updateItem } from './api';
import { CreateTItemDto, ItemListParams, UpdateTItemDto } from './types';

export const useItemList = (params: ItemListParams) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => fetchItems(params),
    keepPreviousData: true,
  });
};

export const useItem = (id: number) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => fetchItem(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTItemDto) => createItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTItemDto }) => updateItem(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', variables.id] });
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
