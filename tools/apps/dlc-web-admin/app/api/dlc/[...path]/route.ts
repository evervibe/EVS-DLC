/**
 * SSR Auth Proxy for DLC API
 * 
 * This route handler proxies requests to the backend API and injects
 * the JWT token from an HttpOnly cookie, enabling secure authentication
 * without exposing the token to client-side JavaScript.
 * 
 * Security:
 * - JWT stored in HttpOnly cookie (dlc_token)
 * - Cookie is never echoed back to the client
 * - Selective header forwarding (no hop-by-hop headers)
 * - 30s timeout per request
 * - Aborts on client disconnect
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:30089';
const TIMEOUT_MS = 30000;

// Headers to exclude from forwarding
const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'te',
  'trailer',
  'proxy-authorization',
  'proxy-authenticate',
  'upgrade',
  'cookie', // Never forward cookies to backend
]);

/**
 * Build the target URL for proxying
 */
function buildTargetUrl(path: string[], searchParams: URLSearchParams): string {
  const pathStr = path.join('/');
  const search = searchParams.toString();
  return `${API_BASE}/${pathStr}${search ? `?${search}` : ''}`;
}

/**
 * Forward selected headers from request, adding Authorization if JWT is present
 */
function buildForwardHeaders(request: NextRequest, jwt?: string): HeadersInit {
  const headers: Record<string, string> = {};

  // Forward safe headers
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!HOP_BY_HOP_HEADERS.has(lowerKey)) {
      headers[key] = value;
    }
  });

  // Inject JWT as Bearer token if available
  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }

  return headers;
}

/**
 * Proxy handler supporting all HTTP methods
 */
async function handleProxy(request: NextRequest, params: { path: string[] }) {
  const { path } = params;
  const method = request.method;

  // Get JWT from HttpOnly cookie
  const cookieStore = await cookies();
  const jwt = cookieStore.get('dlc_token')?.value;

  // Build target URL
  const targetUrl = buildTargetUrl(path, request.nextUrl.searchParams);

  // Build headers with JWT injection
  const headers = buildForwardHeaders(request, jwt);

  // Setup abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Forward request body if present
    let body: BodyInit | null = null;
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await request.text();
      } else {
        body = await request.arrayBuffer();
      }
    }

    // Make proxied request
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    // Forward response
    const responseBody = await response.arrayBuffer();
    
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle timeout
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Request timeout' },
        { status: 504 }
      );
    }

    // Handle network errors
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Service unavailable', error: error.message },
      { status: 503 }
    );
  }
}

// Export handlers for all methods
export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleProxy(request, params);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleProxy(request, params);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleProxy(request, params);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleProxy(request, params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleProxy(request, params);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleProxy(request, params);
}
