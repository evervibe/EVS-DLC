export interface TSkillLevel {
  id: number;
  skill_id: number;
  level: number;
  required_exp: number | null;
  effect_value: number | null;
}

export type CreateTSkillLevelDto = Omit<TSkillLevel, 'id'>;
export type UpdateTSkillLevelDto = Partial<CreateTSkillLevelDto>;
