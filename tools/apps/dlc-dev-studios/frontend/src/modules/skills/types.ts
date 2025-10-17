export interface TSkill {
  a_index: number;
  a_name: string | null;
  a_job: number;
  a_type: number;
  a_maxLevel: number;
  a_targetType: number;
  a_client_description: string | null;
}

export interface SkillListMeta {
  total: number;
  limit: number;
  offset: number;
  search?: string;
}

export interface SkillListParams {
  page: number;
  pageSize: number;
  search?: string;
}

export type CreateTSkillDto = Partial<Omit<TSkill, 'a_index'>> & { a_index: number };
export type UpdateTSkillDto = Partial<Omit<TSkill, 'a_index'>>;
