import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSkill, deleteSkill, fetchSkill, fetchSkills, updateSkill } from './api';
import { CreateTSkillDto, SkillListParams, UpdateTSkillDto } from './types';

export const useSkillList = (params: SkillListParams) =>
  useQuery({
    queryKey: ['skills', params],
    queryFn: () => fetchSkills(params),
    keepPreviousData: true,
  });

export const useSkill = (id: number) =>
  useQuery({
    queryKey: ['skills', id],
    queryFn: () => fetchSkill(id),
    enabled: !!id,
  });

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTSkillDto) => createSkill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTSkillDto }) => updateSkill(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills', variables.id] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSkill(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  });
};
