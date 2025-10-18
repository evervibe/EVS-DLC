# Build Note: v1.4.1 - Server-Side Fetch Improvements

**Date:** 2025-10-18  
**Version:** 1.4.1  
**Focus:** Fix server-side fetch errors, wire robust API proxy, stabilize Strings/Counts pages

## Summary

This release resolves server-side rendering (SSR) issues related to invalid URLs, connection errors, and authentication failures. The key improvements include:

1. **Absolute URL helper for SSR** - New `lib/http.ts` module ensures all server-side fetches use absolute URLs
2. **Enhanced API proxy** - Updated proxy configuration with flexible environment variables for auth and API base
3. **Dashboard counts via proxy** - Dashboard metrics now use the authenticated proxy route
4. **User-friendly error display** - New `ErrorBox` component for better error messaging
5. **Comprehensive test coverage** - Added tests for the new HTTP helpers

## Changes Made

### New Files

- **`lib/http.ts`** - Server-side fetch utilities
  - `absoluteUrl()` - Converts relative paths to absolute URLs for SSR
  - `serverFetchJSON()` - Fetch with automatic URL resolution and JSON parsing

- **`components/ErrorBox.tsx`** - User-friendly error display component

- **`lib/__tests__/http.test.ts`** - Comprehensive tests for HTTP helpers

### Updated Files

- **`.env.example`** - Added new environment variables:
  - `APP_ORIGIN` - Next.js app origin for server-side absolute URLs (default: `http://localhost:5174`)
  - `DLC_API_BASE` - Backend API base URL (default: `http://localhost:30089`)
  - `AUTH_COOKIE_NAME` - Name of authentication cookie (default: `dlc_token`)

- **`app/api/dlc/[...path]/route.ts`** - Enhanced proxy route
  - Now uses `DLC_API_BASE` environment variable
  - Configurable auth cookie name via `AUTH_COOKIE_NAME`
  - Falls back to multiple cookie names for compatibility

- **`app/dashboard/_data/getCounts.ts`** - Dashboard metrics loader
  - Replaced direct API calls with proxy-based fetches using `serverFetchJSON`
  - Ensures authentication headers are passed correctly
  - Uses absolute URLs to avoid SSR errors

- **`package.json`** - Version bump to 1.4.1

## Benefits

### ✅ No More "Invalid URL" in SSR
All server-side fetches now use absolute URLs via the `absoluteUrl()` helper or the `serverFetchJSON()` utility. Pages like `/dashboard`, `/items`, `/skills`, `/skilllevels`, and `/strings` render without runtime errors.

### ✅ Authentication Passthrough
The Next.js API proxy at `/api/dlc/[...path]` properly forwards:
- HTTP method (GET, POST, PUT, DELETE, etc.)
- Request headers
- Query strings
- Request body
- Authentication cookies

This ensures that authenticated endpoints return data (200 OK) instead of authorization errors (401).

### ✅ Reliable Dashboard Metrics
Dashboard counts are fetched from:
- `/api/dlc/data/t_item/count`
- `/api/dlc/data/t_skill/count`
- `/api/dlc/data/t_skilllevel/count`
- `/api/dlc/data/t_string/count`

Numbers now match the database because requests go through the authenticated proxy.

### ✅ Better Error Display
The new `ErrorBox` component displays error title and message instead of cryptic stack traces, improving the user experience when network errors occur.

### ✅ Test Coverage
Comprehensive test suite for the new HTTP helpers ensures reliability:
- Tests for absolute URL conversion
- Tests for server-side JSON fetching
- Tests for error handling
- All tests passing ✓

## Configuration

### Environment Setup

Update your `.env` file with the following variables (see `.env.example`):

```bash
# Next app origin (for server-side absolute URLs)
APP_ORIGIN=http://localhost:5174

# DLC API base URL (backend Nest/Fastify app)
DLC_API_BASE=http://localhost:30089

# Name of auth cookie set by /login
AUTH_COOKIE_NAME=dlc_token
```

### Restart Required

After updating environment variables, restart the development server:

```bash
pnpm dev
```

## Technical Details

### absoluteUrl() Logic

1. If URL is already absolute → return as-is
2. If running client-side → return relative path
3. If running server-side:
   - Check `APP_ORIGIN` env var first
   - Fall back to `x-forwarded-proto` and `x-forwarded-host` headers
   - Construct absolute URL

### serverFetchJSON() Logic

1. Convert path to absolute URL using `absoluteUrl()`
2. Fetch with `cache: 'no-store'` to avoid stale data
3. Parse JSON response
4. Throw descriptive error on failure

### Proxy Route Enhancement

The proxy now:
- Prioritizes `DLC_API_BASE` env var over `NEXT_PUBLIC_API_URL`
- Supports configurable cookie name via `AUTH_COOKIE_NAME`
- Falls back to common cookie names (`token`, `access_token`) for compatibility
- Forwards all safe headers (excludes hop-by-hop headers)
- Handles all HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)

## Validation

### Build ✓
```bash
$ pnpm build
✓ Compiled successfully
✓ Generating static pages (12/12)
```

### Tests ✓
```bash
$ pnpm test
Test Suites: 3 passed, 3 total
Tests:       11 passed, 11 total
```

### Type Check ✓
```bash
$ pnpm type-check
✓ No TypeScript errors
```

## Migration Notes

If you're upgrading from v1.4.0:

1. Add the new environment variables to your `.env` file
2. Restart your development server
3. No code changes required - all updates are backward compatible

## Known Issues

- ESLint plugin conflict warning (pre-existing, not related to this release)
- No impact on functionality

## Next Steps

Future enhancements could include:

1. Optional Husky pre-commit hooks for automated linting and type checking
2. Additional error boundary components for better error recovery
3. Retry logic for transient network failures
4. Request/response caching strategies

## References

- Issue: Fix server-side fetch errors (Invalid URL, ECONNREFUSED, 401)
- Repository: `evervibe/EVS-DLC`
- Scope: `tools/apps/dlc-web-admin`
- Framework: Next.js 15 + React 19
