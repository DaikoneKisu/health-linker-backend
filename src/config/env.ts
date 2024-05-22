import { config } from 'dotenv'
import { validateEnv } from '@/utils/validate-env'
config({ path: `.env.${process.env['NODE_ENV'] || 'development'}` })

export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  CREDENTIALS,
  PUBLIC_DIR,
  DATABASE_URL,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD
} = validateEnv()
