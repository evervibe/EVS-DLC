/**
 * Shared API Client for EVS-DLC
 * Provides a centralized API client for all applications
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:30089';

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
 * Canonical Endpoints for data resources
 * Note: These point to the API server. For SSR with auth, use the proxy at /api/dlc/*
 */
export const Endpoints = {
  counts: {
    items:       '/data/t_item/count',
    skills:      '/data/t_skill/count',
    skilllevels: '/data/t_skilllevel/count',
    strings:     '/data/t_string/count',
  },
  list: {
    items:       '/data/t_item',
    skills:      '/data/t_skill',
    skilllevels: '/data/t_skilllevel',
    strings:     '/data/t_string',
  },
  strings: {
    list:          '/strings',
    detail:        (id: number) => `/strings/${id}`,
    update:        (id: number) => `/strings/${id}`,
    submitReview:  (id: number) => `/strings/${id}/submit-review`,
    approve:       (id: number) => `/strings/${id}/approve`,
    reject:        (id: number) => `/strings/${id}/reject`,
    bulkImport:    '/strings/bulk/import',
    exportPreview: '/strings/export/preview',
    exportPublish: '/strings/export/publish',
  },
} as const;

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
 * Count API
 */
export async function getCount(endpoint: string): Promise<{ count: number }> {
  const response = await fetchApi<any>(endpoint);
  // Handle both direct count response and wrapped response
  if (typeof response === 'object' && 'data' in response && typeof response.data === 'object' && 'count' in response.data) {
    return { count: response.data.count };
  }
  if (typeof response === 'object' && 'count' in response) {
    return { count: response.count };
  }
  return { count: 0 };
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
  count: () => getCount(Endpoints.counts.items),
};

// Skills
export const skillsApi = {
  getAll: () => getAll<any>('skills'),
  getById: (id: number) => getById<any>('skills', id),
  create: (data: any) => create<any>('skills', data),
  update: (id: number, data: any) => update<any>('skills', id, data),
  delete: (id: number) => remove('skills', id),
  count: () => getCount(Endpoints.counts.skills),
};

// Skill Levels
export const skillLevelsApi = {
  getAll: () => getAll<any>('skilllevels'),
  getById: (id: number) => getById<any>('skilllevels', id),
  create: (data: any) => create<any>('skilllevels', data),
  update: (id: number, data: any) => update<any>('skilllevels', id, data),
  delete: (id: number) => remove('skilllevels', id),
  count: () => getCount(Endpoints.counts.skilllevels),
};

// Strings
export const stringsApi = {
  getAll: () => getAll<any>('strings'),
  getById: (id: number) => getById<any>('strings', id),
  create: (data: any) => create<any>('strings', data),
  update: (id: number, data: any) => update<any>('strings', id, data),
  delete: (id: number) => remove('strings', id),
  count: () => getCount(Endpoints.counts.strings),
};

/**
 * Proxy-aware fetch helpers for SSR with authentication
 * These should be used in Next.js server components and actions
 */

/**
 * Fetch JSON via proxy with no-store caching
 */
export async function getJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const proxyPath = path.startsWith('/api/dlc') ? path : `/api/dlc${path}`;
  
  const response = await fetch(proxyPath, {
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
}

/**
 * POST JSON via proxy
 */
export async function postJSON<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
  const proxyPath = path.startsWith('/api/dlc') ? path : `/api/dlc${path}`;
  
  return getJSON<T>(proxyPath, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT JSON via proxy
 */
export async function putJSON<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
  const proxyPath = path.startsWith('/api/dlc') ? path : `/api/dlc${path}`;
  
  return getJSON<T>(proxyPath, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE via proxy
 */
export async function deleteJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const proxyPath = path.startsWith('/api/dlc') ? path : `/api/dlc${path}`;
  
  return getJSON<T>(proxyPath, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * Upload file via proxy (multipart/form-data)
 */
export async function uploadFile<T>(path: string, formData: FormData, options?: RequestInit): Promise<T> {
  const proxyPath = path.startsWith('/api/dlc') ? path : `/api/dlc${path}`;
  
  const response = await fetch(proxyPath, {
    ...options,
    method: 'POST',
    body: formData,
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

  return (await response.json()) as T;
}
