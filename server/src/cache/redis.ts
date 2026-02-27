import { createClient } from 'redis'
import type { RedisClientType } from 'redis'
import { env } from '../config/env.js'

let redis: RedisClientType

declare global {
  var _redis: RedisClientType | undefined
}

// Client Configuration
if (!global._redis) {
  global._redis = createClient({
    url: env.REDIS_URL,
    socket: {
      // Robust Retry Strategy
      reconnectStrategy: (retries) => {
        // Log the attempt
        console.warn(`⚠️ Redis disconnected. Retrying attempt #${retries}...`)
        return Math.min(retries * 100, 3000)
      }
    }
  })

  // Error Logging (Prevent Unhandled Exception Crashes)
  global._redis.on('error', (err) => {
    // Only log "Connection refused" as warning, others as error
    if (err.message.includes('ECONNREFUSED')) {
      console.warn('⚠️ Redis connection refused (Is Redis running?)')
    } else {
      console.error('❌ Redis Client Error:', err)
    }
  })

  global._redis.on('connect', () => console.log('🔌 Redis connecting...'))
  global._redis.on('ready', () => console.log('✅ Redis connected successfully'))
}

redis = global._redis as RedisClientType

// Explicit Connection Management (Exported Functions)
export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
}

export const disconnectRedis = async () => {
  if (redis.isOpen) {
    await redis.quit()
    console.log('Redis connection closed.')
  }
}

export { redis }

// Safe Cache Helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      if (!data) return null
      
      // Safety: Handle corrupt JSON
      return JSON.parse(data) as T
    } catch (err) {
      console.error(`❌ Redis Parse Error for key "${key}":`, err)
      return null // Return null instead of crashing
    }
  },

  async set(key: string, value: any, ttlSeconds?: number) {
    try {
      const stringified = JSON.stringify(value)
      if (ttlSeconds) {
        await redis.set(key, stringified, { EX: ttlSeconds })
      } else {
        await redis.set(key, stringified)
      }
    } catch (err) {
      console.error(`❌ Redis Set Error for key "${key}":`, err)
    }
  },

  async del(key: string) {
    try {
      await redis.del(key)
    } catch (err) {
      console.error(`❌ Redis Del Error for key "${key}":`, err)
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (err) {
      console.error(`❌ Redis Exists Error for key "${key}":`, err)
      return false
    }
  }
}