import { db } from "../database/index.js";
import { users } from "../database/schema.js";
import { eq, or } from "drizzle-orm";
import argon2 from "argon2";
import { sign } from "hono/jwt";
import type { SignupInput, LoginInput } from "../validations/auth.schema.js";
import { env } from "../config/env.js";

export class AuthService {
  async signup(input: SignupInput) {
    // 1. Pre-check: Don't waste CPU hashing if user exists
    const existing = await db.query.users.findFirst({
      where: or(eq(users.email, input.email), eq(users.username, input.username)),
    });

    if (existing) {
      const field = existing.email === input.email ? "Email" : "Username";
      throw new Error(`${field} already registered`); // Use a custom error class in real prod
    }

    // 2. Hash now that we're reasonably sure the user is new
    const hashedPassword = await argon2.hash(input.password);

    try {
      const [newUser] = await db.insert(users).values({
        username: input.username,
        email: input.email,
        password: hashedPassword,
      }).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      });

      return newUser;
    } catch (error: any) {
      // 3. Fallback for Race Conditions (if another request created the user between check and insert)
      if (error.code === "23505") {
        throw new Error("Conflict: User data updated simultaneously. Please try again.");
      }
      throw error; 
    }
  }

  async login(input: LoginInput) {
    // 1. Fetch user from Postgres
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    // 2. Security: Constant-time password verification
    // If user doesn't exist, we verify a dummy hash to prevent timing attacks
    const dummyHash = "$argon2id$v=19$m=65536,t=3,p=4$6P6..."; 
    const isValid = user 
      ? await argon2.verify(user.password, input.password) 
      : await argon2.verify(dummyHash, "dummy_password");

    if (!user || !isValid) {
      throw new Error("Invalid email or password");
    }

    // 3. Prepare Token Payloads
    const now = Math.floor(Date.now() / 1000);
    
    const accessToken = await sign({
      sub: user.id,
      role: "user",
      exp: now + (60 * 15), // 15 Minutes
      iat: now,
    }, env.JWT_SECRET, "HS256");

    const refreshToken = await sign({
      sub: user.id,
      exp: now + (60 * 60 * 24 * 7), // 7 Days
      iat: now,
    }, env.JWT_REFRESH_SECRET, "HS256");

    return {
      user: { id: user.id, username: user.username, email: user.email },
      accessToken,
      refreshToken,
    };
  }
}