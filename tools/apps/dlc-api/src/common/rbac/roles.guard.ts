import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { UserRole, hasRole } from './roles';
import { ROLES_KEY } from './roles.decorator';
import { ApiError } from '../errors';

/**
 * Guard to enforce role-based access control
 * Works with @Roles decorator
 * Version: 1.2.0
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const user = (request as any).user;

    if (!user) {
      throw ApiError.unauthorized('Authentication required');
    }

    // Check if user has required role
    const userRole = user.role as UserRole;
    if (!userRole) {
      throw ApiError.forbidden('User role not defined');
    }

    // Check if user's role has permission for any of the required roles
    const hasPermission = requiredRoles.some(role => hasRole(userRole, role));

    if (!hasPermission) {
      throw ApiError.forbidden(
        `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}
