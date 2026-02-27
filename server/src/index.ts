import { serve } from '@hono/node-server'
import { checkDatabaseConnection, closePool } from './database/index.js'
import { env } from './config/env.js'
import { connectRedis, disconnectRedis } from './cache/redis.js'
import app from './app.js'

const startServer = async () => {
  try {
    // 1. Connect to DB before listening
    await Promise.all([
      checkDatabaseConnection(),
      connectRedis()
    ])

    // 2. Start listening
    const server = serve({
      fetch: app.fetch,
      port: env.PORT
    }, (info) => {
      console.log(`🚀 Server running on Port: ${info.port}`)
    })

    // 3. Graceful Shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`)
      
      server.close(async () => {
        console.log('HTTP server closed.')
        try {
          await Promise.all([
            closePool(),
            disconnectRedis()
          ])
          process.exit(0)
        } catch (err) {
          console.error('Error during database shutdown:', err)
          process.exit(1)
        }
      })

      // Force exit after 10s
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))

  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

startServer()