export interface TItem {
  id: number;
  code: string;
  name: string | null;
  type: number | null;
  level: number | null;
  created_at: string | null;
}

export type CreateTItemDto = Omit<TItem, 'id' | 'created_at'>;
export type UpdateTItemDto = Partial<CreateTItemDto>;
