# DLC API v0.8.4 – Fastify Conflict & Helmet Compatibility Patch

## Overview
DLC API v0.8.4 focuses on stabilising the Fastify integration introduced in the
previous release and aligning the security middleware stack with Fastify 4.x
requirements. The release removes duplicate Fastify handler configuration,
adopts the most reliable Helmet plugin version for the Fastify + NestJS stack
and improves operational visibility for runtime security features.

## Key Changes
- Updated the application bootstrap sequence to rely on the Fastify adapter's
  built-in handlers instead of custom `setNotFoundHandler` logic.
- Enabled Helmet globally using `@fastify/helmet@11.0.0`, the last release that
  is fully compatible with Fastify 4.x and the NestJS adapter.
- Promoted rate limiting middleware logs to confirm runtime activation.
- Switched the Fastify logger to verbose mode for better operational
  troubleshooting.
- Updated root endpoint messaging to reflect v0.8.4 readiness.

## Dependency Updates
- `@fastify/helmet` pinned to **11.0.0** for compatibility with Fastify 4.28.1.

## Operational Notes
- The API now advertises Helmet enablement and rate limiting during bootstrap.
- Ensure the environment variable `API_PORT` remains set to `30089` for
  consistency with internal tooling and documentation.
