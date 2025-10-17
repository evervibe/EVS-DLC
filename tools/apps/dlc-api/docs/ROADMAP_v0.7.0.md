# DLC API Roadmap v0.7.0

## Version History

- **v0.5.0**: Stable local core with database connectivity
- **v0.6.0**: Redis cache layer, performance optimization ✅ **CURRENT**
- **v0.7.0**: Authentication, Authorization, and Security (Planned)

## Overview

Version 0.7.0 focuses on securing the API with comprehensive authentication, role-based access control (RBAC), and audit logging capabilities.

## Goals

1. Implement JWT-based authentication
2. Add role-based access control (RBAC)
3. Create user management system
4. Add audit logging for all operations
5. Implement API metrics and monitoring

## Planned Features

### 1. Authentication Layer

**JWT Token System**
- Token generation and validation
- Refresh token mechanism
- Token expiration and renewal
- Secure token storage

**User Authentication**
- Login endpoint with credentials
- Logout endpoint
- Password hashing with bcrypt
- Account lockout after failed attempts

**Auth Module Structure**
```
src/core/auth/
├── auth.module.ts
├── auth.service.ts
├── jwt.strategy.ts
├── jwt-auth.guard.ts
├── local.strategy.ts
├── local-auth.guard.ts
└── dto/
    ├── login.dto.ts
    └── register.dto.ts
```

**Environment Variables**
```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Password Policy
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_SPECIAL=true
PASSWORD_REQUIRE_NUMBER=true
```

### 2. RBAC System

**Role Definitions**
- `admin`: Full access to all resources
- `moderator`: Read/write access to game data
- `developer`: Read/write access to development endpoints
- `user`: Read-only access to public endpoints
- `guest`: Limited read access

**Permission System**
```typescript
enum Permission {
  READ_DATA = 'read:data',
  WRITE_DATA = 'write:data',
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  READ_LOGS = 'read:logs',
  MANAGE_ROLES = 'manage:roles',
}
```

**Guards and Decorators**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'moderator')
@Get('data/t_item')
async findAll() { ... }

@RequirePermissions(Permission.WRITE_DATA)
@Post('data/t_item')
async create() { ... }
```

**RBAC Module Structure**
```
src/core/rbac/
├── rbac.module.ts
├── rbac.service.ts
├── roles.guard.ts
├── permissions.guard.ts
├── decorators/
│   ├── roles.decorator.ts
│   └── permissions.decorator.ts
└── entities/
    ├── role.entity.ts
    └── permission.entity.ts
```

### 3. User Management

**User Entity** (db_auth.t_user)
- User ID, username, email
- Password hash
- Roles and permissions
- Account status (active, suspended, locked)
- Last login timestamp

**User Module**
```
src/modules/user/
├── user.module.ts
├── user.service.ts
├── user.controller.ts
├── user.entity.ts
└── dto/
    ├── create-user.dto.ts
    ├── update-user.dto.ts
    └── change-password.dto.ts
```

**Endpoints**
- `POST /auth/register` - Create new user
- `POST /auth/login` - Authenticate user
- `POST /auth/logout` - Invalidate token
- `POST /auth/refresh` - Refresh access token
- `GET /users` - List users (admin only)
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `PUT /users/:id/password` - Change password
- `DELETE /users/:id` - Delete user (admin only)

### 4. Audit Logging

**Log Entity** (db_auth.t_log)
- Timestamp
- User ID
- Action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
- Resource type and ID
- IP address
- User agent
- Request/Response details

**Audit Service**
```typescript
@Injectable()
export class AuditService {
  async log(action: AuditAction, details: AuditDetails): Promise<void>
  async getLogsByUser(userId: string): Promise<AuditLog[]>
  async getLogsByResource(resourceType: string, resourceId: string): Promise<AuditLog[]>
  async getLogsByDateRange(start: Date, end: Date): Promise<AuditLog[]>
}
```

**Interceptor**
```typescript
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  // Automatically log all authenticated requests
}
```

### 5. API Metrics

**Metrics Collection**
- Request count per endpoint
- Average response time
- Error rate
- Cache hit/miss ratio
- Active users count

**Metrics Endpoint**
```
GET /metrics
Authorization: Bearer admin-token

Response:
{
  "requests": {
    "total": 15234,
    "last_hour": 523,
    "by_endpoint": { ... }
  },
  "performance": {
    "avg_response_time_ms": 45.3,
    "p95_response_time_ms": 120.5
  },
  "errors": {
    "rate": 0.02,
    "last_hour": 3
  },
  "cache": {
    "hit_rate": 0.85,
    "total_keys": 156
  }
}
```

## Implementation Phases

### Phase 1: Core Authentication (Week 1)
- [ ] JWT module setup
- [ ] Login/logout endpoints
- [ ] Password hashing
- [ ] JWT guards implementation
- [ ] Basic user entity in db_auth

### Phase 2: RBAC Implementation (Week 2)
- [ ] Role entity and service
- [ ] Permission system
- [ ] Role guards and decorators
- [ ] Default roles setup
- [ ] Protect existing endpoints

### Phase 3: User Management (Week 3)
- [ ] User CRUD operations
- [ ] User profile endpoints
- [ ] Password change functionality
- [ ] Account status management
- [ ] Email verification (optional)

### Phase 4: Audit Logging (Week 4)
- [ ] Audit log entity
- [ ] Audit service implementation
- [ ] Audit interceptor
- [ ] Log viewer endpoints
- [ ] Log retention policy

### Phase 5: Metrics & Monitoring (Week 5)
- [ ] Metrics collection service
- [ ] Prometheus integration
- [ ] Metrics endpoint
- [ ] Performance dashboards
- [ ] Alert system setup

## Database Changes

### New Tables (db_auth)

```sql
-- Users table
CREATE TABLE t_user (
  user_id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active', 'suspended', 'locked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL
);

-- Roles table
CREATE TABLE t_role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Role mapping
CREATE TABLE t_user_role (
  user_id VARCHAR(36),
  role_id INT,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES t_user(user_id),
  FOREIGN KEY (role_id) REFERENCES t_role(role_id)
);

-- Audit logs
CREATE TABLE t_log (
  log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(36),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  details JSON,
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_resource (resource_type, resource_id)
);
```

## Security Considerations

1. **Password Security**
   - Bcrypt with cost factor 12
   - Password complexity requirements
   - Password history to prevent reuse

2. **Token Security**
   - Short-lived access tokens (1 hour)
   - Long-lived refresh tokens (7 days)
   - Token blacklist for logout
   - Secure token storage

3. **Rate Limiting**
   - Login endpoint: 5 attempts per 15 minutes
   - API endpoints: 100 requests per minute
   - IP-based throttling

4. **Input Validation**
   - All DTOs validated with class-validator
   - SQL injection prevention
   - XSS protection
   - CSRF protection

5. **Audit Trail**
   - All authenticated actions logged
   - Failed login attempts tracked
   - IP addresses recorded
   - Regular audit review

## Testing Requirements

1. **Unit Tests**
   - Auth service tests
   - JWT strategy tests
   - RBAC guard tests
   - Password hashing tests

2. **Integration Tests**
   - Login/logout flow
   - Token refresh flow
   - Role-based access
   - Audit logging

3. **E2E Tests**
   - User registration flow
   - Authentication flow
   - Protected endpoint access
   - Admin operations

## Migration Path

1. **Backward Compatibility**
   - New auth is opt-in initially
   - Existing endpoints work without auth
   - Gradual migration per module

2. **Default Admin Account**
   ```
   Username: admin
   Password: (generated on first run)
   Role: admin
   ```

3. **Migration Script**
   - Create default roles
   - Create admin user
   - Optionally import existing users

## Documentation Updates

1. **API Documentation**
   - Authentication guide
   - RBAC guide
   - User management guide
   - Audit log API reference

2. **Deployment Guide**
   - Initial setup steps
   - Security hardening
   - Production checklist

3. **Developer Guide**
   - Adding new protected endpoints
   - Creating custom roles
   - Implementing custom permissions

## Success Metrics

- All endpoints protected with appropriate guards
- 100% of authenticated actions logged
- Zero security vulnerabilities in code scan
- <50ms overhead for auth checks
- Comprehensive test coverage (>80%)

## Future Considerations (v0.8.0+)

- OAuth2/OpenID Connect integration
- Multi-factor authentication (MFA)
- API key authentication
- Rate limiting per user/role
- Advanced audit analytics
- Session management
- Single Sign-On (SSO)
