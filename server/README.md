# Backend – Hono + TypeScript

> **Production-ready REST API server** built with Hono, TypeScript, Drizzle ORM, and PostgreSQL. Includes JWT authentication, rate limiting, middleware stack, and containerization.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [Database](#database)
- [Redis Integration](#redis-integration)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## Overview

This is a **minimal yet production-ready** backend implementation using:

- **Hono**: Lightweight, edge-compatible HTTP server framework
- **TypeScript**: Full type safety across the codebase
- **Drizzle ORM**: Type-safe, SQL-first database access
- **PostgreSQL**: Reliable relational database
- **Redis**: Session management, token blacklisting, rate limiting
- **JWT**: Stateless authentication with token rotation

Perfect for building SaaS platforms, REST APIs, microservices, and full-stack applications.

---

## Features

✅ **Authentication**
  - JWT-based access tokens (short-lived, 15 min default)
  - Refresh tokens (long-lived, 7 days default, httpOnly cookie)
  - Token rotation on refresh
  - Secure password hashing (bcrypt)

✅ **Rate Limiting**
  - Per-IP rate limiting via Redis
  - Configurable window and threshold
  - Prevents DDoS and brute-force attacks

✅ **Middleware Stack**
  - Authentication verification
  - CORS with credentials support
  - Request ID tracking for logs
  - Error handling

✅ **Database**
  - Drizzle ORM with type safety
  - PostgreSQL support
  - Migration management
  - Connection pooling

✅ **Caching**
  - Redis integration
  - Token blacklist/rotation
  - Session management

✅ **Error Handling**
  - Standardized error responses
  - HTTP status codes
  - Error logging

✅ **Development Experience**
  - Hot module reloading (HMR)
  - TypeScript strict mode
  - Environment-based config

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Framework | Hono | Latest |
| Language | TypeScript | 5+ |
| Database | PostgreSQL | 15+ |
| ORM | Drizzle | Latest |
| Cache | Redis | 7+ |
| Password Hashing | bcrypt | ^5.0 |
| JWT | jsonwebtoken | ^9.0 |
| Validation | Zod (optional) | ^3.0 |
| HTTP Client | Axios (frontend) | ^1.0 |
| Containerization | Docker | 20+ |

---

## Project Structure

```
server/
├── src/
│   ├── app.ts                    # Hono application setup and middleware
│   ├── index.ts                  # Server entry point
│   │
│   ├── config/
│   │   └── env.ts                # Environment variable loader
│   │
│   ├── routes/
│   │   └── auth.routes.ts        # Authentication endpoints
│   │
│   ├── services/
│   │   └── auth.service.ts       # Business logic for auth
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── rateLimiter.ts        # Request throttling
│   │   └── requestId.ts          # Request tracing
│   │
│   ├── validations/
│   │   └── auth.schema.ts        # Input validation schemas
│   │
│   ├── database/
│   │   ├── index.ts              # Database connection
│   │   └── schema.ts             # Drizzle table definitions
│   │
│   └── cache/
│       └── redis.ts              # Redis client initialization
│
├── .env.example                  # Environment template
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── drizzle.config.ts             # Drizzle ORM configuration
└── Dockerfile                    # Container image definition
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- PostgreSQL 15+ (or Docker)
- Redis 7+ (or Docker)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database and Redis credentials.

3. **Initialize database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Server starts at `http://localhost:3000` with HMR enabled.

### Useful Commands

```bash
npm run dev           # Start dev server with watch
npm run build         # Compile TypeScript
npm start             # Run compiled server
npm run db:push       # Sync schema to database
npm run db:generate   # Create migration files
npm run db:migrate    # Apply migrations
npm run lint          # Check code quality
npm run type-check    # TypeScript type checking
```

---

## API Endpoints

### Authentication Routes

#### Sign Up

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2026-02-27T10:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Email already exists"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

*Note: Refresh token sent as httpOnly cookie automatically.*

#### Refresh Token

```http
POST /auth/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

*Note: New refreshToken cookie issued automatically.*

#### Logout

```http
POST /auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## Authentication

### JWT Token Architecture

**Access Token:**
- **Lifespan**: 15 minutes (configurable)
- **Storage**: Client-side (localStorage or memory)
- **Transport**: `Authorization: Bearer <token>` header
- **Use**: API request authentication
- **Secret**: `JWT_SECRET`

**Refresh Token:**
- **Lifespan**: 7 days (configurable)
- **Storage**: httpOnly cookie (server-managed)
- **Transport**: HTTP cookie (auto sent with requests)
- **Use**: Issuing new access tokens
- **Secret**: `JWT_REFRESH_SECRET`

### Token Rotation

When `/auth/refresh` is called:
1. Old refresh token is validated
2. New access token is issued
3. New refresh token is issued and stored in httpOnly cookie
4. Old refresh token added to Redis blacklist with TTL

This prevents token reuse and improves security.

### Token Verification Flow

```typescript
// In auth.middleware.ts
const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded; // Contains userId, email, iat, exp
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null; // Token expired
    }
    throw error; // Invalid token
  }
};
```

---

## Middleware

### Authentication Middleware (`auth.middleware.ts`)

Verifies JWT access token on protected routes:

```typescript
app.use('*', authMiddleware);

// Inside authMiddleware:
// 1. Extract token from Authorization header
// 2. Verify token signature and expiry
// 3. Populate ctx.req.user with decoded payload
// 4. Continue or reject request
```

### Rate Limiter Middleware (`rateLimiter.ts`)

Enforces per-IP rate limiting using Redis:

```typescript
app.use('*', rateLimiter);

// Inside rateLimiter:
// 1. Extract client IP
// 2. Check Redis counter for IP
// 3. Increment counter
// 4. Return 429 if limit exceeded
// 5. Set expiry via EXPIRE command
```

**Limits** (optional configuration):
- Window: `RATE_LIMIT_WINDOW` seconds (default: 60, if configured)
- Max requests: `RATE_LIMIT_MAX` per window (default: 100, if configured)

### Request ID Middleware (`requestId.ts`)

Assigns unique identifier to each request for tracing:

```typescript
app.use('*', requestIdMiddleware);

// Inside requestIdMiddleware:
// 1. Generate UUID
// 2. Add to ctx.req.headers['x-request-id']
// 3. Include in logs and response headers
```

---

## Database

### Schema Definition (`database/schema.ts`)

Using Drizzle ORM:

```typescript
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Connections (`database/index.ts`)

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
```

### Querying

Type-safe queries with full TypeScript support:

```typescript
// Insert
await db.insert(users).values({
  email: "user@example.com",
  passwordHash: hashedPassword,
});

// Select
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);

// Update
await db
  .update(users)
  .set({ updatedAt: new Date() })
  .where(eq(users.id, userId));
```

### Migrations

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Sync schema directly (development only)
npm run db:push
```

---

## Redis Integration

### Initialization (`cache/redis.ts`)

```typescript
import { createClient } from "redis";

const redis = createClient({ url: REDIS_URL });
redis.connect();
export default redis;
```

### Use Cases

1. **Token Blacklist**
   ```typescript
   // Blacklist refresh token on logout
   await redis.setEx(`blacklist:${tokenId}`, ttl, "true");
   ```

2. **Rate Limiting Counters**
   ```typescript
   // Track requests per IP
   await redis.incr(`rate-limit:${ip}`);
   await redis.expire(`rate-limit:${ip}`, RATE_LIMIT_WINDOW);
   ```

3. **Session Storage**
   ```typescript
   // Store session data
   await redis.setEx(`session:${sessionId}`, 3600, JSON.stringify(data));
   ```

---

## Rate Limiting

### Configuration

Rate limiting can be configured by adding these optional variables to `.env`:
```env
RATE_LIMIT_WINDOW=60        # Time window in seconds (optional)
RATE_LIMIT_MAX=100          # Max requests per window per IP (optional)
```

*Note: These variables are not required in the current setup but can be added for rate limiting configuration.*

### Behavior

- **Per IP**: Each IP address has separate counter
- **Auto-reset**: Counter expires after window duration
- **HTTP 429**: Returned when limit exceeded
- **Header**: `Retry-After` sent with 429 response

### Bypass (Development)

To disable rate limiting in development:
```typescript
if (NODE_ENV === "development") {
  // Skip rate limiter
}
```

---

## Error Handling

### Centralized Error Format

All errors return consistent JSON:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "requestId": "uuid",
  "timestamp": "2026-02-27T10:00:00Z"
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Login successful |
| 201 | Created | User registered |
| 400 | Bad Request | Invalid email format |
| 401 | Unauthorized | Missing/expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | User not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Database connection failed |

### Example Error Handler

```typescript
app.onError((err, ctx) => {
  console.error(`[${ctx.req.header("x-request-id")}]`, err);
  
  return ctx.json({
    error: err.message,
    statusCode: err.statusCode || 500,
    requestId: ctx.req.header("x-request-id"),
    timestamp: new Date().toISOString(),
  }, err.statusCode || 500);
});
```

---

## Configuration

### Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|------------|
| `NODE_ENV` | string | Yes | Environment: `development`, `staging`, `production` |
| `PORT` | number | Yes | Server port |
| `DATABASE_URL` | string | Yes | PostgreSQL connection string (e.g., `postgresql://user:password@host:port/dbname`) |
| `DB_POOL_SIZE` | number | Yes | Database connection pool size |
| `FRONTEND_URL` | string | Yes | Frontend application URL for CORS |
| `REDIS_URL` | string | Yes | Redis connection string (e.g., `redis://localhost:6379`) |
| `JWT_SECRET` | string | Yes | Secret for signing access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | string | Yes | Secret for signing refresh tokens (min 32 chars) |

### Example `.env`

```env
# App Configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:123456@localhost:5433/test4
DB_POOL_SIZE=10

# Frontend
FRONTEND_URL=http://localhost:5173

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets
JWT_SECRET=your_random_secret_key_at_least_32_characters_long
JWT_REFRESH_SECRET=your_random_refresh_secret_key_at_least_32_characters_long
```

---

## Development

### Code Organization

- **Routes** (`routes/`): API endpoint definitions
- **Services** (`services/`): Business logic, database queries
- **Middleware** (`middleware/`): Cross-cutting concerns
- **Validations** (`validations/`): Input schema definitions
- **Database** (`database/`): ORM setup and models
- **Cache** (`cache/`): Redis integration

### Type Safety

```typescript
// Define types for request/response
type SignupRequest = {
  email: string;
  password: string;
};

type SignupResponse = {
  message: string;
  user: User;
  accessToken: string;
};

// Use in routes
app.post("/auth/signup", async (ctx) => {
  const body = await ctx.req.json() as SignupRequest;
  // ... handle signup
  return ctx.json<SignupResponse>({...}, 201);
});
```

### Logging

Add logging for debugging:

```typescript
console.log(`[${ctx.req.header("x-request-id")}] User login attempt:`, email);
```

For production, integrate logging service (e.g., Winston, Pino).

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong random secrets (min 64 chars):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Configure PostgreSQL with backups enabled
- [ ] Enable Redis persistence (RDB or AOF)
- [ ] Setup HTTPS/TLS (use reverse proxy like NGINX)
- [ ] Configure CORS with specific origin (via `FRONTEND_URL`)
- [ ] Review rate limiting thresholds (if configured)
- [ ] Setup logging and monitoring
- [ ] Enable database connection pooling
- [ ] Test token refresh flow end-to-end

### Docker Deployment

**Build image:**
```bash
docker build -t myapp-server:latest .
```

**Run container:**
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_URL=$DATABASE_URL \
  -e DB_POOL_SIZE=$DB_POOL_SIZE \
  -e FRONTEND_URL=$FRONTEND_URL \
  -e REDIS_URL=$REDIS_URL \
  -e JWT_SECRET=$JWT_SECRET \
  -e JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET \
  myapp-server:latest
```

**Docker Compose (with PostgreSQL + Redis):**
```bash
docker-compose up -d
```

### Deployment Platforms

- **Railway**: Push code, set env vars, auto-deploy
- **Render**: Connect GitHub repo, configure environment
- **Fly.io**: Use `flyctl` CLI for deployment
- **AWS EC2 / ECS**: Manual Docker management
- **Heroku**: `git push heroku main` (legacy platform)

---

## Security

### Authentication Security

🔒 **Password Storage**
- Use bcrypt with min 12 salt rounds
- Never store plain passwords
- Use constant-time comparison

🔒 **Token Security**
- Use strong secrets (min 64 random characters)
- Rotate secrets periodically
- Implement token blacklist (Redis)
- httpOnly for refresh tokens only

🔒 **CORS Configuration**
```typescript
app.use(
  cors({
    origin: FRONTEND_URL, // e.g., "http://localhost:5173" or "https://example.com"
    credentials: true,    // Allow cookies
  })
);
```

### Database Security

🔒 **SQL Injection Prevention**
- Use Drizzle ORM parameterized queries
- Never concatenate user input into SQL

🔒 **Connection Security**
- Use SSL/TLS for database connections
- Enable connection pooling
- Limit max connections per user

### API Security

🔒 **Input Validation**
- Validate all request payloads (Zod, etc.)
- Enforce max request size (100KB default)
- Check Content-Type headers

🔒 **Rate Limiting**
- Enable on all public endpoints
- Adjust thresholds based on traffic
- Monitor for abuse

🔒 **Error Messages**
- Don't leak sensitive info in 500 errors
- Log detailed errors server-side only
- Return generic client-side errors

### Dependency Management

🔒 **Audit Dependencies**
```bash
npm audit          # Check for vulnerabilities
npm audit fix      # Auto-fix where possible
npm update         # Update to latest safe versions
```

---

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Verify DATABASE_URL format
# Should be: postgresql://user:password@host:5432/dbname

# Test connection
psql $DATABASE_URL
```

### Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solutions:**
```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
redis-cli ping  # Should return PONG
```

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solutions:**
```bash
# macOS/Linux: Find process on port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### JWT Token Verification Failing

**Check:**
- Token format: `Authorization: Bearer <token>`
- Token expiry: `sub` claim's `exp` field
- Secret matches (`JWT_SECRET`)
- Token not blacklisted in Redis

### Rate Limiting Too Strict

**Adjust in `.env`** (if rate limiting variables are configured):
```env
RATE_LIMIT_WINDOW=120     # Increase window in seconds
RATE_LIMIT_MAX=200        # Increase max requests per window
```

---

## Contributing

Contributions welcome! Please:

1. Follow TypeScript best practices
2. Add tests for new features
3. Update documentation
4. Use conventional commit messages
5. Ensure code passes linting

```bash
git checkout -b feat/my-feature
# ... make changes ...
npm run lint
npm run type-check
git commit -m "feat: add feature description"
git push origin feat/my-feature
```

---

## Support

For issues or questions:

- 📧 Open a GitHub Issue
- 💬 Check existing discussions
- 🐛 Report security issues privately

Happy coding! 🚀
