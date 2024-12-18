import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { userModel } from '@/models/user.model'
import { eq } from 'drizzle-orm'
import { User } from '@/types/user.type'
import { NewUser } from '@/types/new-user.type'
import { UpdateUser } from '@/types/update-user.type'

export class UserRepository {
  private readonly _db: PgDatabase = pgDatabase

  // constructor(db: PgDatabase) {
  //   this._db = db
  // }

  public async findAll() {
    return await this._db
      .select({
        document: userModel.document,
        email: userModel.email,
        fullName: userModel.fullName,
        phoneNumber: userModel.phoneNumber,
        isVerified: userModel.isVerified,
        userType: userModel.userType
      })
      .from(userModel)
  }

  public async findWithLimitAndOffset(limit: number, offset: number) {
    const rows = await this._db
      .select({
        document: userModel.document,
        email: userModel.email,
        fullName: userModel.fullName,
        phoneNumber: userModel.phoneNumber,
        isVerified: userModel.isVerified,
        userType: userModel.userType
      })
      .from(userModel)
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async find(document: User['document']) {
    const rows = await this._db
      .select({
        document: userModel.document,
        email: userModel.email,
        fullName: userModel.fullName,
        phoneNumber: userModel.phoneNumber,
        isVerified: userModel.isVerified,
        userType: userModel.userType
      })
      .from(userModel)
      .where(eq(userModel.document, document))

    return rows.at(0)
  }

  public async findByEmail(email: User['email']) {
    const rows = await this._db
      .select({
        document: userModel.document,
        email: userModel.email,
        fullName: userModel.fullName,
        phoneNumber: userModel.phoneNumber,
        isVerified: userModel.isVerified,
        userType: userModel.userType
      })
      .from(userModel)
      .where(eq(userModel.email, email))

    return rows.at(0)
  }

  public async findLastOnline(document: User['document']) {
    const rows = await this._db
      .select({ lastOnline: userModel.lastOnline })
      .from(userModel)
      .where(eq(userModel.document, document))

    return rows.at(0)?.lastOnline
  }

  public async getPassword(document: User['document']) {
    const rows = await this._db
      .select({
        password: userModel.password
      })
      .from(userModel)
      .where(eq(userModel.document, document))

    return rows.at(0)?.password
  }

  public async create(newUser: NewUser) {
    const rows = await this._db.insert(userModel).values(newUser).returning({
      document: userModel.document,
      email: userModel.email,
      fullName: userModel.fullName,
      phoneNumber: userModel.phoneNumber,
      isVerified: userModel.isVerified,
      userType: userModel.userType
    })

    return rows.at(0)
  }

  public async update(document: User['document'], updateUser: UpdateUser) {
    const rows = await this._db
      .update(userModel)
      .set(updateUser)
      .where(eq(userModel.document, document))
      .returning({
        document: userModel.document,
        email: userModel.email,
        fullName: userModel.fullName,
        phoneNumber: userModel.phoneNumber,
        isVerified: userModel.isVerified,
        userType: userModel.userType
      })

    console.log(rows)

    return rows.at(0)
  }

  public async updateLastOnline(document: User['document']) {
    const rows = await this._db
      .update(userModel)
      .set({
        lastOnline: new Date()
      })
      .where(eq(userModel.document, document))
      .returning({
        document: userModel.document,
        email: userModel.email,
        fullName: userModel.fullName,
        phoneNumber: userModel.phoneNumber,
        isVerified: userModel.isVerified,
        userType: userModel.userType
      })

    return rows.at(0)
  }

  public async delete(document: User['document']) {
    const rows = await this._db
      .delete(userModel)
      .where(eq(userModel.document, document))
      .returning({
        document: userModel.document,
        email: userModel.email,
        fullName: userModel.fullName,
        phoneNumber: userModel.phoneNumber,
        isVerified: userModel.isVerified,
        userType: userModel.userType
      })

    return rows.at(0)
  }
}
