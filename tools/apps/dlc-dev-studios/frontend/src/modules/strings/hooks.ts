import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createString, deleteString, fetchString, fetchStrings, updateString } from './api';
import { CreateTStringDto, StringListParams, UpdateTStringDto } from './types';

export const useStringList = (params: StringListParams) =>
  useQuery({
    queryKey: ['strings', params],
    queryFn: () => fetchStrings(params),
    keepPreviousData: true,
  });

export const useString = (id: number) =>
  useQuery({
    queryKey: ['strings', id],
    queryFn: () => fetchString(id),
    enabled: !!id,
  });

export const useCreateString = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTStringDto) => createString(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['strings'] }),
  });
};

export const useUpdateString = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTStringDto }) => updateString(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['strings'] });
      queryClient.invalidateQueries({ queryKey: ['strings', variables.id] });
    },
  });
};

export const useDeleteString = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteString(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['strings'] }),
  });
};
