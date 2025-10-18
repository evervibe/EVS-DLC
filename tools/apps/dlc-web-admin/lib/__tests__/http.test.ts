/**
 * Tests for lib/http.ts server-side fetch helpers
 */

// Mock Next.js headers - must return a promise with a Map-like object
jest.mock('next/headers', () => ({
  headers: jest.fn(() => Promise.resolve({
    get: jest.fn((key: string) => {
      const mockHeaders: Record<string, string> = {
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'example.com',
        'host': 'example.com',
      };
      return mockHeaders[key];
    }),
  })),
}));

import { absoluteUrl, serverFetchJSON } from '../http';

describe('lib/http', () => {
  describe('absoluteUrl', () => {
    // Save original window
    const originalWindow = global.window;

    beforeEach(() => {
      // Simulate server-side environment
      // @ts-ignore
      delete global.window;
    });

    afterEach(() => {
      // Restore window
      global.window = originalWindow;
    });

    it('should return absolute URLs as-is', async () => {
      const url = 'https://example.com/api/test';
      const result = await absoluteUrl(url);
      expect(result).toBe(url);
    });

    it('should convert relative path to absolute URL', async () => {
      const path = '/api/dlc/strings';
      const result = await absoluteUrl(path);
      expect(result).toMatch(/^https:\/\/example\.com\/api\/dlc\/strings$/);
    });

    it('should handle paths without leading slash', async () => {
      const path = 'api/dlc/strings';
      const result = await absoluteUrl(path);
      expect(result).toMatch(/^https:\/\/example\.com\/api\/dlc\/strings$/);
    });

    it('should use APP_ORIGIN env var when available', async () => {
      const originalEnv = process.env.APP_ORIGIN;
      process.env.APP_ORIGIN = 'http://localhost:5174';
      
      const path = '/api/dlc/strings';
      const result = await absoluteUrl(path);
      expect(result).toBe('http://localhost:5174/api/dlc/strings');
      
      if (originalEnv) {
        process.env.APP_ORIGIN = originalEnv;
      } else {
        delete process.env.APP_ORIGIN;
      }
    });
  });

  describe('serverFetchJSON', () => {
    // Save original
    const originalWindow = global.window;
    let originalEnv: string | undefined;

    beforeAll(() => {
      originalEnv = process.env.APP_ORIGIN;
      // Set APP_ORIGIN globally for all tests to avoid needing headers()
      process.env.APP_ORIGIN = 'https://example.com';
    });

    afterAll(() => {
      // Restore env
      if (originalEnv) {
        process.env.APP_ORIGIN = originalEnv;
      } else {
        delete process.env.APP_ORIGIN;
      }
    });

    beforeEach(() => {
      // Simulate server-side environment
      // @ts-ignore
      delete global.window;
      global.fetch = jest.fn();
    });

    afterEach(() => {
      // Restore window
      global.window = originalWindow;
      jest.resetAllMocks();
    });

    it('should fetch and parse JSON successfully', async () => {
      const mockData = { success: true, data: [] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await serverFetchJSON('/api/test');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/test$/),
        expect.objectContaining({ cache: 'no-store' })
      );
    });

    it('should throw error on non-ok response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(serverFetchJSON('/api/test')).rejects.toThrow('/api/test -> 404');
    });

    it('should include custom fetch options', async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await serverFetchJSON('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        })
      );
    });
  });
});
