/**
 * Role-Based Access Control (RBAC) Roles
 * Version: 1.2.0
 */

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  DEVOPS = 'devops',
}

/**
 * Role hierarchy for permission inheritance
 * Higher roles inherit permissions from lower roles
 */
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [UserRole.USER]: [UserRole.USER],
  [UserRole.ADMIN]: [UserRole.USER, UserRole.ADMIN],
  [UserRole.DEVOPS]: [UserRole.USER, UserRole.ADMIN, UserRole.DEVOPS],
};

/**
 * Check if a user role has permission for a required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole]?.includes(requiredRole) ?? false;
}
