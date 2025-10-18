# Quick Start Guide: v1.3.4 SSR Auth Proxy

**Version:** 1.3.4  
**Feature:** Server-Side Auth Proxy with HttpOnly Cookie Authentication

---

## 🚀 What's New

Version 1.3.4 adds secure authentication for list/CRUD operations using HttpOnly cookies and a server-side proxy, while keeping dashboard counts public and fast.

---

## 🔧 Setup

### 1. Environment Variables

**API (.env)**
```bash
# Required
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# CORS
CORS_ORIGIN=http://localhost:5174
FRONTEND_ORIGIN=http://localhost:5174
```

**Web (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:30089
```

### 2. Install & Build
```bash
pnpm install
pnpm build
```

### 3. Start Services
```bash
# Terminal 1 - API
cd tools/apps/dlc-api
pnpm dev

# Terminal 2 - Web
cd tools/apps/dlc-web-admin
pnpm dev
```

---

## 📱 Usage

### Login
1. Navigate to `http://localhost:5174/login`
2. Enter credentials (default: admin / change-me)
3. Click "Sign In"
4. Redirected to dashboard on success

### Access Protected Data
- Items: `http://localhost:5174/items`
- Skills: `http://localhost:5174/skills`
- Skill Levels: `http://localhost:5174/skilllevels`
- Strings: `http://localhost:5174/strings`

All list pages automatically use authenticated proxy - no code changes needed in components!

### Logout
Click the "Logout" button (to be added to layout) to clear authentication cookie.

---

## 🔐 How It Works

```
Browser → Next.js Proxy → API
         ↓
    HttpOnly Cookie
    (dlc_token)
```

1. **Login:** User submits credentials → API returns JWT → Stored in HttpOnly cookie
2. **Request:** Browser calls `/api/dlc/data/t_item` → Proxy reads cookie → Injects JWT → Calls API
3. **Response:** API validates JWT → Returns data → Proxy forwards to browser
4. **Logout:** Cookie deleted → Future requests unauthorized

---

## 🔍 Testing

### Manual Tests

**Test Public Counts (No Auth Required)**
```bash
curl http://localhost:30089/data/t_item/count
# Expected: {"success":true,"data":{"count":N}}
```

**Test Protected Lists (Auth Required)**
```bash
# Without token - should fail
curl -i http://localhost:30089/data/t_item
# Expected: HTTP/1.1 401 Unauthorized

# Get token
TOKEN=$(curl -s -X POST http://localhost:30089/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"change-me"}' \
  | jq -r '.data.token')

# With token - should succeed
curl -i -H "Authorization: Bearer $TOKEN" http://localhost:30089/data/t_item
# Expected: HTTP/1.1 200 OK
```

**Test Proxy**
```bash
# After logging in through browser
curl -i -H "Cookie: dlc_token=$TOKEN" http://localhost:5174/api/dlc/data/t_item
# Expected: HTTP/1.1 200 OK
```

### Automated Tests
```bash
# Run all tests
pnpm test

# Type-check
pnpm type-check

# Build
pnpm build
```

---

## 🐛 Troubleshooting

### "Unauthorized" Error on List Pages
**Problem:** Not logged in or cookie expired  
**Solution:** Navigate to `/login` and sign in

### "Service Unavailable" Error
**Problem:** API server not running  
**Solution:** Start API server with `pnpm dev` in `tools/apps/dlc-api`

### Login Page Not Working
**Problem:** Wrong credentials or API connection issue  
**Solution:** 
1. Check API is running
2. Verify credentials in API `.env` file
3. Check browser console for errors

### Cookie Not Being Set
**Problem:** Cookie settings or CORS issue  
**Solution:**
1. Check `CORS_ORIGIN` matches frontend URL
2. Clear browser cookies
3. Check browser console for cookie warnings

---

## 📊 API Endpoints

### Public (No Auth)
- `GET /data/t_item/count` - Item count
- `GET /data/t_skill/count` - Skill count
- `GET /data/t_skilllevel/count` - Skill level count
- `GET /data/t_string/count` - String count

### Protected (Auth Required)
- `GET /data/t_item` - List items
- `POST /data/t_item` - Create item
- `PUT /data/t_item/:id` - Update item
- `DELETE /data/t_item/:id` - Delete item
- *(Same pattern for skills, skilllevels, strings)*

### Authentication
- `POST /auth/login` - Login (public)
  - Body: `{"username": "...", "password": "..."}`
  - Returns: `{"success": true, "data": {"token": "..."}}`

---

## 🔐 Security Notes

### Cookie Settings
```typescript
{
  httpOnly: true,        // Not accessible via JavaScript
  sameSite: 'lax',       // CSRF protection
  secure: true,          // HTTPS only (production)
  path: '/',             // Available site-wide
  maxAge: 28800          // 8 hours
}
```

### Security Features
- ✅ JWT never exposed to client JavaScript
- ✅ XSS attack prevention (HttpOnly)
- ✅ CSRF protection (SameSite)
- ✅ CORS restricted to frontend origin
- ✅ Secure flag in production
- ✅ No JWT echo in responses

### Best Practices
1. **Use strong JWT_SECRET** (32+ random characters)
2. **Use strong ADMIN_PASSWORD** (12+ characters, mixed case, numbers, symbols)
3. **Enable HTTPS in production** (automatic with secure flag)
4. **Rotate credentials regularly**
5. **Monitor authentication logs**

---

## 📚 Code Examples

### Using the Proxy in Client Components
```typescript
'use client';

async function fetchItems() {
  // No JWT handling needed!
  const response = await fetch('/api/dlc/data/t_item', {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    const error: any = new Error('Failed to fetch');
    error.status = response.status;
    throw error;
  }
  
  return response.json();
}

function ItemsPage() {
  const { data, error } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems
  });
  
  if (error) {
    return <StatusError error={error} />;
  }
  
  return <div>{/* render items */}</div>;
}
```

### Custom Login Implementation
```typescript
'use server';

import { cookies } from 'next/headers';

export async function customLogin(credentials: LoginData) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  const token = data?.data?.token || data?.token;
  
  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set('dlc_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 hours
  });
}
```

---

## 🎯 Migration from v1.3.3

### For Developers

**Before (v1.3.3):**
```typescript
const response = await fetch(`${API_BASE}/data/t_item`);
```

**After (v1.3.4):**
```typescript
const response = await fetch('/api/dlc/data/t_item', {
  cache: 'no-store'
});
```

### Changes Required
1. Update fetch URLs to use `/api/dlc/*` prefix
2. Add status error handling
3. Remove manual JWT token handling
4. Add login flow for users

### No Changes Required
- Dashboard count fetching (still direct)
- API endpoints (unchanged)
- Database schema (unchanged)

---

## 📞 Support

### Documentation
- Full implementation report: `IMPLEMENTATION_REPORT_v1.3.4.md`
- Verification summary: `VERIFICATION_SUMMARY_v1.3.4.md`
- Changelog: `CHANGELOG.md`

### Issues
- Check existing tests for examples
- Review error messages in browser console
- Verify environment variables are set correctly

---

## ✅ Checklist for Production

- [ ] Strong JWT_SECRET configured
- [ ] Strong ADMIN_PASSWORD configured
- [ ] CORS_ORIGIN set to production frontend URL
- [ ] HTTPS enabled
- [ ] Environment variables verified
- [ ] Login flow tested
- [ ] List pages accessible after login
- [ ] Logout working correctly
- [ ] Error messages displaying correctly
- [ ] Cookie visible in browser DevTools after login

---

**Version:** 1.3.4  
**Last Updated:** 2025-10-18  
**Status:** ✅ Production Ready
