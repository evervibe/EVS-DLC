# Fastify Compatibility Matrix – DLC API v0.8.4

| Component                     | Version | Status                    | Notes |
|-------------------------------|---------|---------------------------|-------|
| Fastify core                  | 4.28.1  | ✅ Supported              | Verified with NestJS Fastify adapter in production mode. |
| @nestjs/platform-fastify      | 10.4.20 | ✅ Supported              | Matches NestJS 10.x framework baseline. |
| @fastify/helmet               | 11.0.0  | ✅ Compatible / Preferred | Last release that interops cleanly with Fastify 4.x + NestJS adapter. |
| @fastify/helmet (>=12.0.0)    | ❌      | Incompatible              | Triggers duplicate handler registration and bootstrap failures. |
| Custom notFound handler       | —       | ⚠️ Avoid                  | Rely on Fastify defaults to prevent double registration. |

## Upgrade Guidance
- When upgrading Fastify beyond 4.x, retest Helmet integration against the new
  major version before promoting to production.
- Keep NestJS and the Fastify adapter on matching major versions to prevent
  lifecycle hook mismatches.
