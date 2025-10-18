// Set environment variables BEFORE any imports
process.env.NODE_ENV = 'test'
process.env.PNPM_REGISTRY_MIRROR = 'https://registry.npmjs.org/'
process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests'
process.env.ADMIN_USERNAME = 'test-admin'
process.env.ADMIN_PASSWORD = 'test-password'
process.env.USE_CACHE = 'false'
process.env.REDIS_URL = 'redis://localhost:9999'
