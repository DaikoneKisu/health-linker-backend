import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import {
  DATABASE_URL,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER
} from '@/config/env'
import { PgDatabase } from '@/types/pg-database.type'

const pool = new Pool({
  host: DATABASE_URL,
  port: DATABASE_PORT,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  ssl: true
})

export const pgDatabase: PgDatabase = drizzle(pool)
