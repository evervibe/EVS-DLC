import { headers } from 'next/headers';

/**
 * Convert a path to an absolute URL for server-side fetch
 * @param path - Path to convert (e.g., '/api/dlc/strings')
 * @returns Absolute URL suitable for server-side fetch
 */
export async function absoluteUrl(path: string): Promise<string> {
  // Already absolute - return as-is
  if (/^https?:\/\//i.test(path)) return path;
  
  // Client-side - return relative path
  if (typeof window !== 'undefined') return path;

  // Server-side - build absolute URL
  let origin = process.env.APP_ORIGIN;
  
  if (!origin) {
    // Fall back to headers if APP_ORIGIN not set
    const h = await headers();
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const host = h.get('x-forwarded-host') ?? h.get('host');
    origin = `${proto}://${host}`;
  }
  
  return `${origin}${path.startsWith('/') ? path : '/' + path}`;
}

/**
 * Server-side fetch with JSON response
 * Automatically converts relative URLs to absolute and handles JSON parsing
 * @param path - Path or absolute URL to fetch
 * @param init - Fetch options
 * @returns Parsed JSON response
 */
export async function serverFetchJSON<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = await absoluteUrl(path);
  const res = await fetch(url, { cache: 'no-store', ...init });
  
  if (!res.ok) {
    throw new Error(`${path} -> ${res.status}`);
  }
  
  return res.json() as Promise<T>;
}
