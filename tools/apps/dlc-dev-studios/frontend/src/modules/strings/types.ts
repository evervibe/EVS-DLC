export interface TString {
  a_index: number;
  a_string: string | null;
  a_string_usa: string | null;
  a_string_ger: string | null;
  a_string_twn: string | null;
}

export interface StringListMeta {
  total: number;
  limit: number;
  offset: number;
  search?: string;
}

export interface StringListParams {
  page: number;
  pageSize: number;
  search?: string;
}

export type CreateTStringDto = Partial<Omit<TString, 'a_index'>> & { a_index: number };
export type UpdateTStringDto = Partial<Omit<TString, 'a_index'>>;
