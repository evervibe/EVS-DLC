'use server';

import { getJSON, putJSON, postJSON } from '@evs-dlc/shared-lib';
import { Locale, WorkflowStatus } from '@evs-dlc/shared-lib';

export interface StringsListParams {
  q?: string;
  langMissing?: Locale;
  status?: WorkflowStatus;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
}

export interface StringWithMeta {
  a_index: number;
  [key: string]: any;
  meta?: {
    status: WorkflowStatus;
    version: number;
    hash: string;
    updated_by: string;
    updated_at: string;
    approved_by?: string | null;
    approved_at?: string | null;
    rejected_reason?: string | null;
  };
}

export interface StringsListResponse {
  success: boolean;
  data: StringWithMeta[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

/**
 * Fetch strings list with filters
 */
export async function fetchStrings(params: StringsListParams): Promise<StringsListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.q) queryParams.set('q', params.q);
  if (params.langMissing) queryParams.set('langMissing', params.langMissing);
  if (params.status) queryParams.set('status', params.status);
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.offset) queryParams.set('offset', params.offset.toString());
  if (params.orderBy) queryParams.set('orderBy', params.orderBy);
  if (params.orderDir) queryParams.set('orderDir', params.orderDir);

  const path = `/strings?${queryParams.toString()}`;
  return getJSON<StringsListResponse>(path, { cache: 'no-store' as any });
}

/**
 * Fetch single string with metadata
 */
export async function fetchString(id: number): Promise<{ success: boolean; data: StringWithMeta }> {
  return getJSON<{ success: boolean; data: StringWithMeta }>(`/strings/${id}`);
}

/**
 * Update string values
 */
export async function updateString(
  id: number,
  values: Record<string, string>
): Promise<{ success: boolean; data: StringWithMeta; message: string }> {
  return putJSON<{ success: boolean; data: StringWithMeta; message: string }>(`/strings/${id}`, values);
}

/**
 * Submit string for review
 */
export async function submitForReview(
  id: number
): Promise<{ success: boolean; data: StringWithMeta; message: string }> {
  return postJSON<{ success: boolean; data: StringWithMeta; message: string }>(`/strings/${id}/submit-review`, {});
}

/**
 * Approve string
 */
export async function approveString(
  id: number
): Promise<{ success: boolean; data: StringWithMeta; message: string }> {
  return postJSON<{ success: boolean; data: StringWithMeta; message: string }>(`/strings/${id}/approve`, {});
}

/**
 * Reject string
 */
export async function rejectString(
  id: number,
  reason: string
): Promise<{ success: boolean; data: StringWithMeta; message: string }> {
  return postJSON<{ success: boolean; data: StringWithMeta; message: string }>(`/strings/${id}/reject`, { reason });
}

/**
 * Get export preview
 */
export async function getExportPreview(): Promise<any> {
  return getJSON<any>('/strings/export/preview');
}

/**
 * Publish export
 */
export async function publishExport(version: string, notes?: string): Promise<any> {
  return postJSON<any>('/strings/export/publish', { version, notes });
}
