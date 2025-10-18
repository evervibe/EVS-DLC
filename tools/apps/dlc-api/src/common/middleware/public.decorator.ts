import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route as public (bypass authentication)
 * Use this for endpoints that should be accessible without JWT authentication
 * @example
 * @Public()
 * @Get('count')
 * publicCount() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
