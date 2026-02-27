import { jwt } from "hono/jwt";
import { env } from "../config/env.js";

export const isAuthorized = jwt({
  secret: env.JWT_SECRET,
  alg: "HS256"
});