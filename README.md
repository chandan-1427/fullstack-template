# Full‑Stack SaaS Starter Template

> **A production‑ready monorepo starter kit** for building secure, scalable full‑stack applications with modern TypeScript, authentication, and containerization.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0-blue)](https://www.typescriptlang.org)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Authentication Architecture](#authentication-architecture)
- [Configuration](#configuration)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Security Best Practices](#security-best-practices)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This monorepo provides a **batteries-included foundation** for SaaS platforms, marketplace applications, and enterprise full‑stack solutions. It emphasizes **security**, **scalability**, and **developer experience** with pre‑configured patterns for:

- ✅ JWT-based authentication (access + refresh token architecture)
- ✅ Rate limiting and DDoS protection via Redis
- ✅ Type-safe database access with Drizzle ORM
- ✅ Protected routes and role-ready architecture
- ✅ Auto token refresh with Axios interceptors
- ✅ Docker containerization and orchestration
- ✅ Environment-based configuration (dev, staging, prod)

Suitable for **startups**, **MVPs**, **enterprise projects**, and **learning TypeScript full‑stack development**.

---

## Features

### Backend (`server/`)
- **Hono framework**: Lightweight, edge-compatible REST API
- **Drizzle ORM**: Type-safe database queries with PostgreSQL
- **JWT authentication**: industry-standard token architecture
- **Redis caching**: session management, token blacklisting, rate limiting
- **Middleware stack**: auth, request ID tracking, CORS, rate limiting
- **Input validation**: schema-based request validation (built-in)
- **Error handling**: centralized, consistent error responses

### Frontend (`client/`)
- **React 18**: modern UI rendering with hooks
- **TypeScript**: full type safety across components
- **Axios interceptors**: automatic token refresh and error handling
- **AuthContext + AuthProvider**: centralized authentication state
- **ProtectedRoute**: simple route guarding for authenticated pages
- **TailwindCSS**: utility-first styling for rapid UI development
- **Vite**: lightning-fast development server and optimized builds

### Infrastructure
- **Docker Compose**: local PostgreSQL + Redis setup
- **Environment configuration**: `.env`-based settings per environment
- **Git-controlled deployments**: ready for CI/CD integration

---

## Tech Stack

### Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript execution |
| **Framework** | Hono | Lightweight HTTP server |
| **Language** | TypeScript 5+ | Type safety |
| **Database** | PostgreSQL 15+ | Relational data storage |
| **ORM** | Drizzle | Type-safe queries |
| **Cache/Queue** | Redis 7+ | Sessions, rate limiting, tokens |
| **Authentication** | JWT + bcrypt | Stateless auth, password hashing |
| **Validation** | Zod (optional) | Runtime schema validation |
| **Containerization** | Docker | Consistent environments |

### Frontend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | Build tooling |
| **Framework** | React 18+ | UI rendering |
| **Language** | TypeScript 5+ | Type safety |
| **Styling** | TailwindCSS 3+ | Utility CSS framework |
| **HTTP Client** | Axios | Request management + interceptors |
| **Build Tool** | Vite | Fast bundling, HMR |
| **Linting** | ESLint | Code quality |

---

## Architecture

### Monorepo Structure

```
hono-test2/
├── client/                    # React SPA (Vite)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── layouts/      # Page layouts (Navbar, Footer)
│   │   │   └── ui/           # Form, Button, Card, etc.
│   │   ├── context/          # React Context (AuthProvider)
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route wrappers (ProtectedRoute)
│   │   ├── lib/              # Utilities, Axios instance
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── .env.example          # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                    # Hono API (Node.js)
│   ├── src/
│   │   ├── app.ts            # Hono app setup
│   │   ├── index.ts          # Server entry point
│   │   ├── config/           # Configuration (env vars, constants)
│   │   ├── middleware/       # Auth, CORS, rate limiting, request ID
│   │   ├── routes/           # API routes (auth, users, etc.)
│   │   ├── services/         # Business logic
│   │   ├── validations/      # Schema validation
│   │   ├── database/         # Drizzle setup + migrations
│   │   └── cache/            # Redis setup
│   ├── .env.example          # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
│
├── docker-compose.yml        # Local dev services (PostgreSQL, Redis)
├── README.md                 # This file
└── LICENSE                   # MIT License

```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    React SPA (client/)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AuthProvider → useAuth() Hook                            │   │
│  │ Axios Interceptor (auto token refresh)                   │   │
│  │ Protected Routes (role checking)                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────────┘
                 │ HTTP/HTTPS (REST API calls)
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Hono API Server (server/)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Middleware: Auth, CORS, Rate Limit, Request ID          │   │
│  │ ├── JWT token verification                              │   │
│  │ ├── Redis-based rate limiting                           │   │
│  │ └── Request tracing                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes: /auth/login, /auth/signup, /auth/refresh, etc.  │   │
│  │ Services: business logic, database queries              │   │
│  │ Validation: input schema checking                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────┬──────────────────────────────┬────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────────┐      ┌──────────────────┐
│   PostgreSQL DB      │      │  Redis Cache     │
│  - Users             │      │  - Sessions      │
│  - Profiles          │      │  - Rate limits   │
│  - Audit logs        │      │  - Token blacklist
└──────────────────────┘      └──────────────────┘
```

---

## Prerequisites

Before getting started, ensure you have installed:

- **Node.js**: v18.0.0 or higher ([download](https://nodejs.org))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Docker & Docker Compose**: ([download](https://www.docker.com/products/docker-desktop))
- **Git**: for version control

**Verify installations:**
```bash
node --version    # v18.x.x
npm --version     # v9.x.x
docker --version  # Docker version 20.x+
git --version     # git version 2.x+
```

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/saas-starter.git
cd saas-starter
```

### 2. Setup Environment Variables

Copy environment templates and populate with your settings:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Server**.env (minimal):
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:123456@localhost:5433/test4
DB_POOL_SIZE=10
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_random_secret_key_at_least_32_characters_long
JWT_REFRESH_SECRET=your_random_refresh_secret_key_at_least_32_characters_long
```

**Client/.env (minimal):
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=My SaaS App
```

### 3. Start Infrastructure

Spin up PostgreSQL and Redis with Docker Compose:

```bash
docker-compose up -d
```

Verify services:
```bash
docker-compose ps
```

### 4. Install & Run Backend

```bash
cd server
npm install
npm run db:push      # Initialize database schema (if applicable)
npm run dev          # Start dev server (watches for changes)
```

Server will be available at `http://localhost:3000`

### 5. Install & Run Frontend (in a new terminal)

```bash
cd client
npm install
npm run dev          # Start Vite dev server with HMR
```

Frontend will be available at `http://localhost:5173`

### 6. Test the Setup

1. Navigate to `http://localhost:5173`
2. Sign up or log in (uses JWT backend)
3. Access protected dashboard route
4. Observe automatic token refresh on 401 responses

---

## Project Structure

Refer to the **Architecture** section above and individual `README.md` files in each folder:

- **[server/README.md](server/README.md)** – Backend architecture, endpoints, middleware, database
- **[client/README.md](client/README.md)** – Frontend architecture, components, routing, styling

---

## Authentication Architecture

### JWT Token Flow

```
User Signup/Login
       │
       ▼
┌──────────────────────────────────────┐
│ /auth/login or /auth/signup          │
│ - Validate credentials               │
│ - Hash password (bcrypt)             │
│ - Generate tokens                    │
└──────────────────────────────────────┘
       │
       ├─→ Access Token (15 min, memory/localStorage)
       │   - Short-lived
       │   - Sent in Authorization header
       │   - Used for API requests
       │
       └─→ Refresh Token (7 days, httpOnly cookie)
           - Long-lived
           - Stored in secure httpOnly cookie
           - Used to issue new access tokens
           - Rotated after each refresh

Protected Route Request
       │
       ├─ Access token valid? ──YES──→ Request succeeds
       │
       └─ Access token expired? ──YES──→ /auth/refresh
           - Validate refresh token from cookie
           - Issue new tokens
           - Retry original request
           │
           └─ Refresh invalid? ──→ Redirect to login
```

### Security Features

- ✅ **httpOnly Cookies**: Tokens stored server-side, not accessible via JavaScript
- ✅ **CORS with credentials**: Cross-origin requests with proper origin validation
- ✅ **Token rotation**: Refresh tokens rotated after each use
- ✅ **Redis blacklist**: Invalidated tokens stored in Redis with TTL
- ✅ **Password hashing**: bcrypt with configurable rounds
- ✅ **Rate limiting**: Per-IP request throttling via Redis

---

## Configuration

### Environment Variables

#### Server

| Variable | Type | Description |
|----------|------|----------|
| `NODE_ENV` | string | Environment: `development`, `staging`, `production` |
| `PORT` | number | Server port |
| `DATABASE_URL` | string | PostgreSQL connection string |
| `DB_POOL_SIZE` | number | Database connection pool size |
| `FRONTEND_URL` | string | Frontend application URL for CORS |
| `REDIS_URL` | string | Redis connection string |
| `JWT_SECRET` | string | Secret for signing access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | string | Secret for signing refresh tokens (min 32 chars) |

#### Client

| Variable | Type | Default | Description |
|----------|------|---------|------------|
| `VITE_API_BASE_URL` | string | — | Backend API base URL (e.g., `http://localhost:3000`) |
| `VITE_APP_NAME` | string | — | Application name displayed in UI |

---

## Docker Deployment

### Local Development

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

### Production Image Build

Build optimized Docker image for server:

```bash
cd server
docker build -t myapp-server:latest .
docker run -p 3000:3000 --env-file .env myapp-server:latest
```

For frontend, use a multi-stage build:

```bash
cd client
docker build -t myapp-client:latest .
docker run -p 80:80 myapp-client:latest
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong random secrets for JWT (min 64 chars)
- [ ] Enable HTTPS (TLS 1.3)
- [ ] Configure CORS with specific origin domains
- [ ] Set rate limits appropriate for your traffic
- [ ] Enable request logging and monitoring
- [ ] Configure database backups
- [ ] Setup Redis persistence
- [ ] Use environment-specific configs (staging, prod)
- [ ] Review all `.env` secrets (never commit)

### Deployment Platforms

**Vercel** (Frontend):
```bash
vercel link
vercel deploy
```

**Railway / Render / Fly.io** (Backend):
1. Push code to GitHub
2. Connect repo to platform
3. Set environment variables
4. Deploy

**AWS / GCP / Azure** (Self-managed):
- Use Docker images with container orchestration (ECS, GKE, AKS)
- Configure load balancers, CDN, auto-scaling

---

## Security Best Practices

### Backend

- 🔒 **Never commit secrets** – use `.env` files with `.gitignore`
- 🔒 **Rotate JWT secrets** – periodically update `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- 🔒 **Use HTTPS only** – enforce TLS 1.3 in production
- 🔒 **Validate all input** – use schema validation (Zod, etc.)
- 🔒 **Rate limiting** – enabled by default, adjust for your use case
- 🔒 **CORS** – configure specific origins, avoid `*` in production
- 🔒 **Secure cookies** – `httpOnly`, `Secure`, `SameSite=Strict`
- 🔒 **SQL injection** – use Drizzle ORM parameterized queries
- 🔒 **Dependency audit** – run `npm audit` regularly

### Frontend

- 🔒 **Store tokens securely** – use localStorage for access tokens, cookies for refresh
- 🔒 **XSS protection** – sanitize user input, avoid `dangerouslySetInnerHTML`
- 🔒 **CSRF protection** – rely on httpOnly cookies + CORS validation
- 🔒 **CSP headers** – configure Content Security Policy on server
- 🔒 **Dependency scan** – audit npm packages for vulnerabilities
- 🔒 **Secure API calls** – use HTTPS, verify SSL certificates

---

## Development Guidelines

### Code Style

- Use **TypeScript** for type safety
- Follow **ESLint** rules (configured)
- Use **Prettier** for automatic formatting (optional)
- Write **meaningful commit messages** (conventional commits)

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/my-feature

# Commit work
git commit -m "feat: add user profile endpoint"

# Push and open PR
git push origin feat/my-feature
```

### Database Migrations

```bash
# With Drizzle
npm run db:generate  # Create migration
npm run db:migrate   # Apply migration
npm run db:push      # Sync schema
```

---

## Troubleshooting

### Port Already in Use

```bash
# macOS/Linux: Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps

# Verify connection string in .env
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Test connection
psql $DATABASE_URL
```

### Redis Connection Error

```bash
# Verify Redis is running
docker-compose ps redis

# Test Redis connection
redis-cli ping  # Should return PONG
```

### Port 5173 Already in Use (Frontend)

```bash
# Use different port
npm run dev -- --port 5174
```

### CORS Errors

- Verify `VITE_API_BASE_URL` matches backend origin
- Check backend CORS middleware configuration
- Ensure cookies are sent: `withCredentials: true` in Axios

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/my-feature`
3. **Commit your changes**: `git commit -m "feat: add feature"`
4. **Push to branch**: `git push origin feat/my-feature`
5. **Open a Pull Request** with a detailed description

### Contribution Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure code passes linting
- Write clear commit messages

---

## Acknowledgments

This starter template is built on the shoulders of excellent open-source projects:

- [Hono](https://hono.dev) – Fast edge runtime framework
- [React](https://react.dev) – UI library
- [Drizzle ORM](https://orm.drizzle.team) – Type-safe ORM
- [Vite](https://vitejs.dev) – Fast build tool
- [TailwindCSS](https://tailwindcss.com) – Utility CSS framework
- [Axios](https://axios-http.com) – HTTP client

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this template in both commercial and non-commercial projects.

---

## Support

For issues, questions, or suggestions:

- 📧 Open a [GitHub Issue](https://github.com/your-org/saas-starter/issues)
- 💬 Start a [Discussion](https://github.com/your-org/saas-starter/discussions)
- 🐛 Report [Security Issues](SECURITY.md) privately

---

**Happy building! 🚀**
