import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load env for CLI execution
dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: process.env.NODE_ENV !== "production",
  strict: true,
});