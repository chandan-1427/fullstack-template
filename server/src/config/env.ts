import 'dotenv/config';

interface env {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  DB_POOL_SIZE: number;
  FRONTEND_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

// helper throws an error if a variable is missing
function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

const port = Number(process.env.PORT);
const db_pool_size = Number(process.env.DB_POOL_SIZE);

export const env: env = {
  NODE_ENV: (process.env.NODE_ENV as env['NODE_ENV']) || 'development',
  PORT: Number.isFinite(port) ? port : 3000,
  DATABASE_URL: requireEnv('DATABASE_URL'),
  DB_POOL_SIZE: Number.isFinite(db_pool_size) ? db_pool_size : 10,
  FRONTEND_URL: requireEnv('FRONTEND_URL'),
  REDIS_URL: requireEnv('REDIS_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET')
}

console.log(`Config loaded. Env: ${env.NODE_ENV}, Port: ${env.PORT}`)
