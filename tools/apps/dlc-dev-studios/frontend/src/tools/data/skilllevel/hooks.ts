import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSkillLevels, getSkillLevel, createSkillLevel, updateSkillLevel, deleteSkillLevel } from './api';
import { CreateTSkillLevelDto, UpdateTSkillLevelDto } from './types';

export const useSkillLevels = () => {
  return useQuery({
    queryKey: ['skilllevels'],
    queryFn: async () => {
      const response = await getSkillLevels();
      return response.data;
    },
  });
};

export const useSkillLevel = (id: number) => {
  return useQuery({
    queryKey: ['skilllevels', id],
    queryFn: async () => {
      const response = await getSkillLevel(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateSkillLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTSkillLevelDto) => createSkillLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skilllevels'] });
    },
  });
};

export const useUpdateSkillLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTSkillLevelDto }) => 
      updateSkillLevel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skilllevels'] });
    },
  });
};

export const useDeleteSkillLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteSkillLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skilllevels'] });
    },
  });
};
