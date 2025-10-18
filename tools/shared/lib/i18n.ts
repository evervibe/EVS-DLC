/**
 * Shared i18n constants and types for EVS-DLC Localization
 */

/**
 * Language mapping from locale code to database column name
 * This defines the canonical mapping for all 26 supported languages
 */
export const LANG_MAP = {
  usa: 'a_string_usa',
  ger: 'a_string_ger',
  spn: 'a_string_spn',
  frc: 'a_string_frc',
  rus: 'a_string_rus',
  kor: 'a_string',          // historisch "base" column
  twn: 'a_string_twn',
  chn: 'a_string_chn',
  thai: 'a_string_thai',
  thai_eng: 'a_string_thai_eng',
  twn2: 'a_string_twn2',
  jpn: 'a_string_jpn',
  mal: 'a_string_mal',
  mal_eng: 'a_string_mal_eng',
  brz: 'a_string_brz',
  hk: 'a_string_hk',
  hk_eng: 'a_string_hk_eng',
  pld: 'a_string_pld',
  tur: 'a_string_tur',
  spn2: 'a_string_spn2',
  frc2: 'a_string_frc2',
  ita: 'a_string_ita',
  mex: 'a_string_mex',
  nld: 'a_string_nld',
  uk: 'a_string_uk',
  dev: 'a_string_dev',
} as const;

/**
 * Locale type - any key from LANG_MAP
 */
export type Locale = keyof typeof LANG_MAP;

/**
 * Column name type - any value from LANG_MAP
 */
export type ColumnName = typeof LANG_MAP[Locale];

/**
 * Maximum length for localized strings
 */
export const MAX_LEN = 255;

/**
 * Workflow status for string entries
 */
export type WorkflowStatus = 'draft' | 'review' | 'approved';

/**
 * User roles for RBAC
 */
export type UserRole = 'editor' | 'reviewer' | 'publisher' | 'admin';

/**
 * String entry with metadata
 */
export interface StringEntry {
  a_index: number;
  // Language values
  [key: string]: any;
  // Metadata
  meta?: StringMetadata;
}

/**
 * String metadata for workflow tracking
 */
export interface StringMetadata {
  status: WorkflowStatus;
  version: number;
  hash: string;
  updated_by: string;
  updated_at: string;
  approved_by?: string | null;
  approved_at?: string | null;
  rejected_reason?: string | null;
}

/**
 * Helper to get column name from locale
 */
export function getColumnName(locale: Locale): ColumnName {
  return LANG_MAP[locale];
}

/**
 * Helper to get locale from column name
 */
export function getLocaleFromColumn(columnName: string): Locale | undefined {
  const entry = Object.entries(LANG_MAP).find(([_, col]) => col === columnName);
  return entry ? (entry[0] as Locale) : undefined;
}

/**
 * Get all supported locales
 */
export function getAllLocales(): Locale[] {
  return Object.keys(LANG_MAP) as Locale[];
}

/**
 * Get all column names
 */
export function getAllColumns(): ColumnName[] {
  return Object.values(LANG_MAP);
}

/**
 * Validate string value
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateStringValue(value: string): ValidationResult {
  const errors: string[] = [];

  if (value.length > MAX_LEN) {
    errors.push(`Value exceeds maximum length of ${MAX_LEN} characters`);
  }

  // Check for control characters (except newlines and tabs which might be intentional)
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(value)) {
    errors.push('Value contains invalid control characters');
  }

  // Trim check
  if (value !== value.trim()) {
    errors.push('Value has leading or trailing whitespace');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check placeholder consistency between strings
 * Common patterns: {0}, {1}, %s, %d, etc.
 */
export function checkPlaceholderConsistency(reference: string, value: string): ValidationResult {
  const errors: string[] = [];
  
  // Extract placeholders from both strings
  const refPlaceholders = extractPlaceholders(reference);
  const valPlaceholders = extractPlaceholders(value);
  
  // Check if counts match
  if (refPlaceholders.length !== valPlaceholders.length) {
    errors.push(`Placeholder count mismatch: expected ${refPlaceholders.length}, got ${valPlaceholders.length}`);
  }
  
  // Check if same placeholders exist
  for (const ph of refPlaceholders) {
    if (!valPlaceholders.includes(ph)) {
      errors.push(`Missing placeholder: ${ph}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

function extractPlaceholders(str: string): string[] {
  const patterns = [
    /\{\d+\}/g,        // {0}, {1}, etc.
    /%[sd]/g,          // %s, %d
    /\$\{\w+\}/g,      // ${name}
  ];
  
  const placeholders: string[] = [];
  for (const pattern of patterns) {
    const matches = str.match(pattern);
    if (matches) {
      placeholders.push(...matches);
    }
  }
  
  return [...new Set(placeholders)].sort();
}
