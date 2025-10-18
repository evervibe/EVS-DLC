/**
 * Shared API Client for EVS-DLC
 * Provides a centralized API client for all applications
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30089';

/**
 * Generic API error class
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      throw new ApiError(
        response.status,
        (typeof errorData === 'object' && errorData?.message) || `HTTP ${response.status}: ${response.statusText}`,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error or server unreachable', error);
  }
}

/**
 * Health Check API
 */
export async function getHealth() {
  return fetchApi<{ status: string; timestamp: string }>('/health');
}

export async function getHealthReady() {
  return fetchApi<{ 
    status: string; 
    databases: Record<string, string>;
    cache?: string;
  }>('/health/ready');
}

/**
 * Generic CRUD Operations
 */
export async function getAll<T>(resource: string): Promise<T[]> {
  return fetchApi<T[]>(`/game/${resource}`);
}

export async function getById<T>(resource: string, id: number): Promise<T> {
  return fetchApi<T>(`/game/${resource}/${id}`);
}

export async function create<T>(resource: string, data: Partial<T>): Promise<T> {
  return fetchApi<T>(`/game/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function update<T>(
  resource: string,
  id: number,
  data: Partial<T>
): Promise<T> {
  return fetchApi<T>(`/game/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function remove(resource: string, id: number): Promise<void> {
  return fetchApi<void>(`/game/${resource}/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Specific Resource APIs
 */

// Items
export const itemsApi = {
  getAll: () => getAll<any>('items'),
  getById: (id: number) => getById<any>('items', id),
  create: (data: any) => create<any>('items', data),
  update: (id: number, data: any) => update<any>('items', id, data),
  delete: (id: number) => remove('items', id),
};

// Skills
export const skillsApi = {
  getAll: () => getAll<any>('skills'),
  getById: (id: number) => getById<any>('skills', id),
  create: (data: any) => create<any>('skills', data),
  update: (id: number, data: any) => update<any>('skills', id, data),
  delete: (id: number) => remove('skills', id),
};

// Skill Levels
export const skillLevelsApi = {
  getAll: () => getAll<any>('skilllevels'),
  getById: (id: number) => getById<any>('skilllevels', id),
  create: (data: any) => create<any>('skilllevels', data),
  update: (id: number, data: any) => update<any>('skilllevels', id, data),
  delete: (id: number) => remove('skilllevels', id),
};

// Strings
export const stringsApi = {
  getAll: () => getAll<any>('strings'),
  getById: (id: number) => getById<any>('strings', id),
  create: (data: any) => create<any>('strings', data),
  update: (id: number, data: any) => update<any>('strings', id, data),
  delete: (id: number) => remove('strings', id),
};
