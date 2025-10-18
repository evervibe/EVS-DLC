'use server';

/**
 * Server actions for authentication
 * Handles login/logout with HttpOnly cookie management
 */

import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:30089';
const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds

export interface LoginResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Login action - authenticates user and sets HttpOnly cookie
 */
export async function loginAction(username: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      return {
        success: false,
        message: errorData.message || 'Invalid credentials',
      };
    }

    const data = await response.json();
    
    // Extract JWT from response
    // Handle both wrapped format { success: true, data: { token: "..." } }
    // and direct format { token: "..." }
    let token: string | undefined;
    if (data?.data?.token) {
      token = data.data.token;
    } else if (data?.token) {
      token = data.token;
    } else if (data?.data?.access_token) {
      token = data.data.access_token;
    } else if (data?.access_token) {
      token = data.access_token;
    }

    if (!token) {
      return {
        success: false,
        message: 'No token received from server',
      };
    }

    // Set HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('dlc_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error or server unreachable',
      error: error.message,
    };
  }
}

/**
 * Logout action - clears the HttpOnly cookie
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('dlc_token');
}

/**
 * Check if user is authenticated (has valid cookie)
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('dlc_token');
  return !!token;
}
