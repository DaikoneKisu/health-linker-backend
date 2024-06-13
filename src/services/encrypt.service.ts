import { genSalt, hash, compare } from 'bcrypt'
import { BCRYPT_SALT_ROUNDS } from '@/config/env'

export class EncryptService {
  public async encryptPassword(password: string): Promise<string> {
    const salt = await genSalt(BCRYPT_SALT_ROUNDS)

    return hash(password, salt)
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}
