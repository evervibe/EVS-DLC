export interface TItem {
  a_index: number;
  a_name: string | null;
  a_name_usa: string | null;
  a_type_idx: number;
  a_level: number;
  a_price: number;
  a_enable: number;
  a_descr: string | null;
}

export interface ItemListMeta {
  total: number;
  limit: number;
  offset: number;
  search?: string;
}

export interface ItemListParams {
  page: number;
  pageSize: number;
  search?: string;
}

export type CreateTItemDto = Partial<Omit<TItem, 'a_index'>>;
export type UpdateTItemDto = Partial<Omit<TItem, 'a_index'>>;
