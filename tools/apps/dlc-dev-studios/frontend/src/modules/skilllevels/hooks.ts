import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSkillLevel, deleteSkillLevel, fetchSkillLevel, fetchSkillLevels, updateSkillLevel } from './api';
import { CreateTSkillLevelDto, SkillLevelListParams, UpdateTSkillLevelDto } from './types';

export const useSkillLevelList = (params: SkillLevelListParams) =>
  useQuery({
    queryKey: ['skilllevels', params],
    queryFn: () => fetchSkillLevels(params),
    keepPreviousData: true,
  });

export const useSkillLevel = (id: number) =>
  useQuery({
    queryKey: ['skilllevels', id],
    queryFn: () => fetchSkillLevel(id),
    enabled: !!id,
  });

export const useCreateSkillLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTSkillLevelDto) => createSkillLevel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skilllevels'] });
    },
  });
};

export const useUpdateSkillLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTSkillLevelDto }) => updateSkillLevel(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skilllevels'] });
      queryClient.invalidateQueries({ queryKey: ['skilllevels', variables.id] });
    },
  });
};

export const useDeleteSkillLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSkillLevel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skilllevels'] }),
  });
};
