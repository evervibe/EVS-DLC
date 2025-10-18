import { SetMetadata } from '@nestjs/common';
import { UserRole } from './roles';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 * @param roles - Array of roles that are allowed to access the route
 * @example
 * @Roles(UserRole.ADMIN)
 * @Get('admin-only')
 * adminOnlyRoute() { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
