/**
 * Utility helper functions
 */

/**
 * Sleep for a given number of milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Format a date to ISO string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Generate a random string
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Deep clone an object using structuredClone (Node 17+)
 * Falls back to JSON method for compatibility but has limitations
 * (doesn't handle functions, undefined values in arrays, etc.)
 */
export const deepClone = <T>(obj: T): T => {
  // Use structuredClone if available (Node 17+)
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  // Fallback to JSON method (has limitations)
  return JSON.parse(JSON.stringify(obj));
};
