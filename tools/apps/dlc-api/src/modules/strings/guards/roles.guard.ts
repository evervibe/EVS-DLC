import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@evs-dlc/shared-lib';
import { ROLES_KEY } from './roles.decorator';

/**
 * Guard to check if user has required roles
 * Assumes JWT auth has already validated the request and set user on request
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user (shouldn't happen if JWT guard is in place), deny
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has role in JWT claims
    // Support both 'role' and 'roles' claims (single or array)
    const userRoles: UserRole[] = [];
    
    if (user.role) {
      if (Array.isArray(user.role)) {
        userRoles.push(...user.role);
      } else {
        userRoles.push(user.role);
      }
    }
    
    if (user.roles) {
      if (Array.isArray(user.roles)) {
        userRoles.push(...user.roles);
      } else {
        userRoles.push(user.roles);
      }
    }

    // Admin role has access to everything
    if (userRoles.includes('admin')) {
      return true;
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(`Requires one of roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
