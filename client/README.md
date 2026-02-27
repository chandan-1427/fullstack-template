# 🌐 Frontend – React + TypeScript

A feature‑based React SPA with authentication, auto token refresh, and protected routes.

---

## 🏗️ Architecture Overview

```
src/
 ├─ components/
 │    ├─ layouts/ (Navbar, Footer)
 │    └─ ui/      (reusable UI widgets)
 ├─ context/
 │    ├─ AuthContext.tsx
 │    ├─ AuthProvider.tsx
 │    └─ useAuth.ts
 ├─ lib/
 │    └─ api.ts   ← configured Axios instance
 ├─ pages/        (Dashboard, Login, Signup, Landing)
 └─ routes/       (ProtectedRoute.tsx)
```

Each feature lives in a self‑contained folder for clarity and scalability.

---

## 🛡️ AuthProvider + Context

AuthProvider holds auth state and exposes login, logout, and refresh methods.  
Tokens stored:

- **access token**: localStorage (or in‑memory if preferred).
- **refresh token**: httpOnly cookie managed by the backend.

useAuth() hook returns context values for components.

---

## 🔁 Axios Interceptors

Configured in `lib/api.ts`:

- Attach access token to `Authorization` header.
- On 401, attempt to call `/auth/refresh`.
- If refresh succeeds, retry original request.
- If refresh fails, redirect to login.

This enables the **auto‑refresh flow**: the frontend never deals with the refresh token directly.

---

## 🚧 ProtectedRoute

ProtectedRoute component (in `routes/ProtectedRoute.tsx`) checks auth context:

```tsx
return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
```

Used to guard dashboard and other secure pages.

---

## 🔄 Token Refresh Flow

1. Access token expires.
2. API returns 401.
3. Axios interceptor triggers /auth/refresh.
4. Backend verifies httpOnly cookie and issues new tokens.
5. Frontend stores new access token, original request retried.

---

## 🔌 Connecting to Backend

Set `VITE_API_BASE_URL` in `client/.env` (e.g. `http://localhost:3000`). 
Axios instance uses this base URL.

---

## 📁 Folder Structure

- **components/** – presentational and layout components.
- **context/** – React context for auth.
- **lib/** – shared libraries (Axios, helpers).
- **pages/** – routeable pages.
- **routes/** – router wrappers like ProtectedRoute.

---

## 🌍 Environment Variables

| Name | Description |
|---------------------|-------------------------------------------|
| `VITE_API_BASE_URL` | Backend API URL (with protocol) |

Stored in .env and accessed via import.meta.env.

---

## 🚀 Production Considerations

- Build with `npm run build` and serve static files from CDN or server.
- Ensure CORS credentials allowed on API.
- Use HTTPS and set Secure flag on cookies.
- Minify and tree‑shake bundles (configured by Vite/Tailwind).
- Consider storing access token in memory if XSS risk is high.

---

## 💡 Future Ideas

- Add role‑based pages.
- Integrate a design system.
- Implement form validation and error handling.
- Migrate to Redux or Zustand if state grows.

Each README is designed to be clear, professional, and tailored to this starter template; fork it, adapt it, and launch your next SaaS with confidence.
