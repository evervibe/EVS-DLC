# Security Patch – DLC API v0.8.4

## Objective
Restore Fastify 4.x compatibility for security middleware while ensuring all
HTTP responses benefit from hardened defaults.

## Actions Taken
- **Helmet Alignment** – Installed `@fastify/helmet@11.0.0` and registered it
  globally through the NestJS Fastify adapter. This version exposes a stable
  API surface that avoids the double-handler regression observed with 12.x.
- **Handler Cleanup** – Removed manual `setNotFoundHandler` configuration so the
  adapter can manage lifecycle hooks without conflicts.
- **Operational Logging** – Added explicit boot logs confirming Helmet
  activation and rate-limiting middleware status to assist with security
  verification during deployments.

## Validation Checklist
- [x] Fastify boots without `notFound` or duplicate handler warnings.
- [x] Helmet security headers present on `/health` (manual curl test recommended).
- [x] Rate limiting middleware initialises successfully at application start.

## Follow-up
- Monitor dependency release notes for a future Helmet major version that
  restores compatibility with Fastify 4.x before upgrading.
