import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { verify, JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../errors';
import { env } from '../../config/env';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

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

    try {
      const payload = verify(token, env.jwtSecret) as JwtPayload | string;
      (request as any).user =
        typeof payload === 'string'
          ? { sub: payload }
          : payload;
      return true;
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired token', 'AUTH_INVALID_TOKEN');
    }
  }
}
