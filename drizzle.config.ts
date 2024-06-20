import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
config({ path: `.env.${process.env['NODE_ENV'] || 'development'}` })

export default defineConfig({
  out: './drizzle-migrations',
  schema: './src/models/*.model.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_URL!,
    port: parseInt(process.env.DATABASE_PORT!, 10),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    ssl: process.env.DATABASE_URL! === 'localhost' ? false : true
  },
  verbose: true,
  strict: true,
  introspect: {
    casing: 'camel'
  }
})
