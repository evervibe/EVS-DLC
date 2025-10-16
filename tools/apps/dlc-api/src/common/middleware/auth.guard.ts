import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiError } from '../errors';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw ApiError.unauthorized('No authorization header provided');
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw ApiError.unauthorized('Invalid authorization header format');
    }

    const token = parts[1];
    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    // TODO: Implement actual JWT validation logic here
    // For now, this is a placeholder that accepts any token
    // In production, you would verify the JWT signature and decode the payload
    
    // Add user info to request (placeholder)
    (request as any).user = { id: 'placeholder-user-id' };

    return true;
  }
}
