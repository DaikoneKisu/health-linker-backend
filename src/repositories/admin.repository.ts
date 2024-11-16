import { eq } from 'drizzle-orm'
import { type PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { Admin, FindAdmin, NewAdmin, UpdateAdmin } from '@/types/admin.type'
import { adminModel } from '@/models/admin.model'
import { NotFoundError, UnauthorizedError } from 'routing-controllers'
import { EncryptService } from '@/services/encrypt.service'
import { sign } from 'jsonwebtoken'
import { EXPIRES_IN, SECRET_KEY } from '@/config/env'

export class AdminRepository {
  private readonly _db: PgDatabase = pgDatabase
  private readonly _encryptService: EncryptService

  constructor(encryptService: EncryptService) {
    this._encryptService = encryptService
  }

  public async findAll(): Promise<FindAdmin[]> {
    return (
      (await this._db
        .select({
          email: adminModel.email,
          fullName: adminModel.fullName
        })
        .from(adminModel)) || []
    )
  }

  public async findWithLimitAndOffset(limit: number, offset: number): Promise<FindAdmin[]> {
    const rows = await this._db
      .select({
        email: adminModel.email,
        fullName: adminModel.fullName
      })
      .from(adminModel)
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async find(email: Admin['email']): Promise<FindAdmin | undefined> {
    const rows = await this._db
      .select({
        email: adminModel.email,
        fullName: adminModel.fullName
      })
      .from(adminModel)
      .where(eq(adminModel.email, email))

    return rows.at(0)
  }

  public async getPassword(email: Admin['email']): Promise<string | undefined> {
    const rows = await this._db
      .select({
        password: adminModel.password
      })
      .from(adminModel)
      .where(eq(adminModel.email, email))

    return rows.at(0)?.password
  }

  public async create(newAdmin: NewAdmin): Promise<FindAdmin | undefined> {
    const rows = await this._db.insert(adminModel).values(newAdmin).returning({
      email: adminModel.email,
      fullName: adminModel.fullName
    })

    return rows.at(0)
  }

  public async update(
    email: Admin['email'],
    updateAdmin: UpdateAdmin
  ): Promise<FindAdmin | undefined> {
    const rows = await this._db
      .update(adminModel)
      .set(updateAdmin)
      .where(eq(adminModel.email, email))
      .returning({
        email: adminModel.email,
        fullName: adminModel.fullName
      })

    return rows.at(0)
  }

  public async delete(email: Admin['email']): Promise<FindAdmin | undefined> {
    const rows = await this._db.delete(adminModel).where(eq(adminModel.email, email)).returning({
      email: adminModel.email,
      fullName: adminModel.fullName
    })

    return rows.at(0)
  }

  public async signIn(email: Admin['email'], password: Admin['password']) {
    const admin = await this.find(email)

    if (!admin) {
      //! This could be a security risk, as it could allow an attacker to enumerate users (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
      //TODO: Implement a way to handle consistently the error message for both existent and non-existent users
      throw new NotFoundError('El usuario con el correo provisto no está registrado.')
    }

    const adminPassword = await this.getPassword(email)

    if (!adminPassword) {
      throw new NotFoundError('El usuario con el correo provisto no está registrado.')
    }

    const isPasswordValid = await this._encryptService.comparePassword(password, adminPassword)

    if (!isPasswordValid) {
      //! This could be a security risk, as it could allow an attacker to enumerate users (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
      //TODO: Implement a way to handle consistently the error message for both existent and non-existent users
      throw new UnauthorizedError('La contraseña provista es incorrecta.')
    }

    return { token: this.tokenize(admin), fullName: admin.fullName }
  }

  private tokenize(user: FindAdmin) {
    return sign(user, SECRET_KEY, {
      expiresIn: EXPIRES_IN,
      notBefore: '0ms',
      algorithm: 'HS256'
    })
  }
}
