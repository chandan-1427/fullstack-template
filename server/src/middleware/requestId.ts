import { randomUUID } from "crypto";
import type { Context, Next } from "hono";

export const requestId = async (c: Context, next: Next) => {
  const id = randomUUID();
  c.set("requestId", id);
  c.header("X-Request-Id", id);

  await next();
};