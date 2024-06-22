import { bool, cleanEnv, port, str } from 'envalid'
import { nat } from '@utils/nat'

export const validateEnv = () => {
  return cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    SECRET_KEY: str(),
    LOG_FORMAT: str(),
    LOG_DIR: str(),
    ORIGIN: str(),
    CREDENTIALS: bool(),
    PUBLIC_DIR: str(),
    DATABASE_URL: str(),
    DATABASE_PORT: port(),
    DATABASE_NAME: str(),
    DATABASE_USER: str(),
    DATABASE_PASSWORD: str(),
    BCRYPT_SALT_ROUNDS: nat(),
    EXPIRES_IN: nat(),
    PUBLIC_PATH: str(),
    MAX_FILESIZE: nat()
  })
}
