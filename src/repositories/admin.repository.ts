import { eq } from 'drizzle-orm'
import { type PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { Admin, FindAdmin, NewAdmin, UpdateAdmin } from '@/types/admin.type'
import { adminModel } from '@/models/admin.model'

export class AdminRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindAdmin[]> {
    return await this._db
      .select({
        email: adminModel.email,
        fullName: adminModel.fullName
      })
      .from(adminModel)
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
}
