import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSkills, getSkill, createSkill, updateSkill, deleteSkill } from './api';
import { CreateTSkillDto, UpdateTSkillDto } from './types';

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await getSkills();
      return response.data;
    },
  });
};

export const useSkill = (id: number) => {
  return useQuery({
    queryKey: ['skills', id],
    queryFn: async () => {
      const response = await getSkill(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTSkillDto) => createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTSkillDto }) => 
      updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};
