# Security Summary – v0.8.3

## Overview
The v0.8.3 release focuses on removing incompatible Fastify plugins and pinning framework dependencies to known-good versions. A custom middleware-based rate limiter now protects the API without relying on external modules.

## Key Actions
- Removed `@fastify/rate-limit`, eliminating the incompatible plugin and reducing exposure to upstream vulnerabilities.
- Pinned NestJS platform packages (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-fastify`) to 10.4.20 alongside Fastify 4.28.1 to guarantee compatibility.
- Locked validation and serialization packages (`class-transformer`, `class-validator`, `reflect-metadata`) to stable releases to prevent regression from implicit upgrades.

## Operational Notes
- The native middleware enforces a limit of 100 requests per minute per IP, returning HTTP 429 when exceeded.
- Health checks now report `rateLimit: "active"` to aid runtime monitoring.
- Dependency versions should be reviewed quarterly to capture upstream security updates.
