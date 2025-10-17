export interface TSkillLevel {
  a_index: number;
  a_level: number;
  a_needHP: number;
  a_needMP: number;
  a_needGP: number;
  a_learnLevel: number;
  skill?: {
    a_index: number;
    a_name: string | null;
  };
}

export interface SkillLevelListMeta {
  total: number;
  limit: number;
  offset: number;
  search?: string;
  skillId?: number;
}

export interface SkillLevelListParams {
  page: number;
  pageSize: number;
  search?: string;
  skillId?: number;
}

export type CreateTSkillLevelDto = Partial<Omit<TSkillLevel, 'a_index'>> & { a_index: number };
export type UpdateTSkillLevelDto = Partial<Omit<TSkillLevel, 'a_index'>>;
