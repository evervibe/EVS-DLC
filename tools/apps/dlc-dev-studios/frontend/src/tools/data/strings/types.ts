export interface TString {
  id: number;
  key: string;
  value: string | null;
  language: string | null;
}

export type CreateTStringDto = Omit<TString, 'id'>;
export type UpdateTStringDto = Partial<CreateTStringDto>;
