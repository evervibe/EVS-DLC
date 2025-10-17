/**
 * @Cacheable decorator for caching method results
 * 
 * Usage:
 * @Cacheable({ key: 't_item_all', ttl: 60 })
 * async findAll() { ... }
 * 
 * Note: This is a placeholder for future implementation.
 * Currently, we use cache.wrap() directly in services for better control.
 */
export interface CacheableOptions {
  key: string;
  ttl?: number;
}

export function Cacheable(options: CacheableOptions): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // Decorator implementation can be added in future iterations
    // For now, we use cache.wrap() directly for better control
    return descriptor;
  };
}
