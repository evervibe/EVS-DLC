import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@evs-dlc/shared-lib';

/**
 * Key for roles metadata
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to set required roles for an endpoint
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
