import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { HTTPException } from "hono/http-exception";

import { env } from "./config/env.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { requestId } from "./middleware/requestId.js";
import authRoutes from "./routes/auth.routes.js";
import { isAuthorized } from "./middleware/auth.middleware.js";

// 🔐 Declare custom context variables
type AppBindings = {
  Variables: {
    requestId: string;
  };
};

const app = new Hono<AppBindings>();

app.use("*", secureHeaders());
app.use("*", requestId);

if (env.NODE_ENV !== "test") {
  app.use("*", logger());
}

const allowedOrigins = [env.FRONTEND_URL];

if (env.NODE_ENV === 'development') {
  app.use('*', async (c, next) => {
    const start = Date.now();
    // Use clone() to avoid draining the stream before the controller gets it
    const body = await c.req.raw.clone().text(); 
    console.log(`🚀 [${c.req.method}] ${c.req.path}`);
    if (body) console.log(`📦 Body:`, body);
    
    await next();
    console.log(`✅ [${c.req.method}] ${c.req.path} - ${Date.now() - start}ms`);
  });
}

app.use("*", cors({
  origin: (origin) => allowedOrigins.includes(origin!) ? origin : null,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 600, // Pre-flight cache to save browser requests
}));

// Environment-based rate limits
if (env.NODE_ENV === "production") {
  // 🌍 Strict production limits
  app.use("*", rateLimiter(100, 15 * 60));        // 100 req / 15 min
  app.use("/api/auth/*", rateLimiter(5, 15 * 60)); // 5 login attempts / 15 min

} else if (env.NODE_ENV === "development") {
  // 🚧 Relaxed dev limits
  app.use("*", rateLimiter(1000, 60));           // 1000 req / 1 min
  app.use("/api/auth/*", rateLimiter(50, 60));   // 50 login attempts / 1 min

} else if (env.NODE_ENV === "test") {
  // 🧪 Disable rate limiting in test
  console.log("Rate limiting disabled in test environment");
}

app.get("/health", (c) =>
  c.json({
    status: "ok",
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
);

app.route("/api/auth", authRoutes);

app.get("/api/me", isAuthorized, (c) => {
  const payload = c.get("jwtPayload"); // Hono automatically decodes the JWT here
  return c.json({
    message: "Authorized access",
    userId: payload.sub,
  });
});

app.onError((err, c) => {
  const requestId = c.get("requestId");

  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        requestId,
      },
      err.status
    );
  }

  console.error({
    message: err.message,
    requestId,
  });

  return c.json(
    {
      success: false,
      message: "Internal server error",
      requestId,
    },
    500
  );
});

export default app;