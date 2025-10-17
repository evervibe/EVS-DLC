export interface TSkill {
  id: number;
  code: string;
  name: string | null;
  description: string | null;
  max_level: number | null;
}

export type CreateTSkillDto = Omit<TSkill, 'id'>;
export type UpdateTSkillDto = Partial<CreateTSkillDto>;
