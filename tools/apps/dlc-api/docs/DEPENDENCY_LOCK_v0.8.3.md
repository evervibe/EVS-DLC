# Dependency Lock – v0.8.3

The following tables capture the pinned runtime and development dependencies for the DLC API release v0.8.3.

## Runtime Dependencies

| Package | Version |
| --- | --- |
| @nestjs/common | 10.4.20 |
| @nestjs/config | 4.0.2 |
| @nestjs/core | 10.4.20 |
| @nestjs/mapped-types | 2.1.0 |
| @nestjs/platform-fastify | 10.4.20 |
| @nestjs/typeorm | 11.0.0 |
| @fastify/helmet | 12.1.0 |
| class-transformer | 0.5.1 |
| class-validator | 0.14.2 |
| dotenv | 16.3.1 |
| fastify | 4.28.1 |
| ioredis | 5.8.1 |
| joi | 18.0.1 |
| jsonwebtoken | 9.0.2 |
| mysql2 | 3.6.5 |
| express | 4.21.1 |
| reflect-metadata | 0.2.2 |
| rxjs | 7.8.1 |
| typeorm | 0.3.27 |

## Development Dependencies

| Package | Version |
| --- | --- |
| @nestjs/testing | 10.4.20 |
| @types/jest | 29.5.11 |
| @types/jsonwebtoken | 9.0.6 |
| @types/express | 4.17.21 |
| @types/node | 20.10.6 |
| jest | 29.7.0 |
| ts-jest | 29.1.1 |
| ts-node | 10.9.2 |
| ts-node-dev | 2.0.0 |
| typescript | 5.3.3 |

## Notes
- All NestJS core packages are aligned on 10.4.20 for compatibility with Fastify 4.28.1.
- Validation tooling (`class-transformer`, `class-validator`) and reflection metadata are pinned to avoid implicit upgrades.
- Rate limiting is provided by internal middleware, so `@fastify/rate-limit` is no longer part of the lock.
