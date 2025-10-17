import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStrings, getString, createString, updateString, deleteString } from './api';
import { CreateTStringDto, UpdateTStringDto } from './types';

export const useStrings = () => {
  return useQuery({
    queryKey: ['strings'],
    queryFn: async () => {
      const response = await getStrings();
      return response.data;
    },
  });
};

export const useString = (id: number) => {
  return useQuery({
    queryKey: ['strings', id],
    queryFn: async () => {
      const response = await getString(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateString = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTStringDto) => createString(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strings'] });
    },
  });
};

export const useUpdateString = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTStringDto }) => 
      updateString(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strings'] });
    },
  });
};

export const useDeleteString = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteString(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strings'] });
    },
  });
};
