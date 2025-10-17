# v0.8.3 – Dependency lock and native rate limiting

## Added
- Introduced a built-in rate limiting middleware to replace the deprecated Fastify plugin.
- Documented dependency alignment and security posture for the stabilization release.

## Changed
- Updated NestJS, Fastify, and validation packages to pinned versions compatible with the 0.8.3 runtime.
- Replaced Fastify rate limit plugin usage with the new middleware and exposed its status via the health endpoint.
- Bumped application metadata and health reporting to reflect version 0.8.3.

## Removed
- Dropped the `@fastify/rate-limit` dependency in favor of the native middleware solution.
