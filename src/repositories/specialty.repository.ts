import { eq } from 'drizzle-orm'
import { pgDatabase } from '@/pg-database'
import { PgDatabase } from '@/types/pg-database.type'
import { specialtyModel } from '@/models/specialty.model'
import { FindSpecialty, NewSpecialty, Specialty, UpdateSpecialty } from '@/types/specialty.type'

export class SpecialtyRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindSpecialty[]> {
    return (
      (await this._db
        .select({
          id: specialtyModel.id,
          name: specialtyModel.name
        })
        .from(specialtyModel)) || []
    )
  }

  public async findWithLimitAndOffset(limit: number, offset: number): Promise<FindSpecialty[]> {
    const rows = await this._db
      .select({
        id: specialtyModel.id,
        name: specialtyModel.name
      })
      .from(specialtyModel)
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async find(id: Specialty['id']): Promise<FindSpecialty | undefined> {
    const rows = await this._db
      .select({
        id: specialtyModel.id,
        name: specialtyModel.name
      })
      .from(specialtyModel)
      .where(eq(specialtyModel.id, id))

    return rows.at(0)
  }

  public async findByName(name: Specialty['name']): Promise<FindSpecialty | undefined> {
    const rows = await this._db
      .select({
        id: specialtyModel.id,
        name: specialtyModel.name
      })
      .from(specialtyModel)
      .where(eq(specialtyModel.name, name))

    return rows.at(0)
  }

  public async create(newSpecialty: NewSpecialty): Promise<FindSpecialty | undefined> {
    const rows = await this._db.insert(specialtyModel).values(newSpecialty).returning({
      id: specialtyModel.id,
      name: specialtyModel.name
    })

    return rows.at(0)
  }

  public async update(
    id: Specialty['id'],
    updateSpecialty: UpdateSpecialty
  ): Promise<FindSpecialty | undefined> {
    const rows = await this._db
      .update(specialtyModel)
      .set(updateSpecialty)
      .where(eq(specialtyModel.id, id))
      .returning({
        id: specialtyModel.id,
        name: specialtyModel.name
      })

    return rows.at(0)
  }

  public async delete(id: Specialty['id']): Promise<FindSpecialty | undefined> {
    const rows = await this._db.delete(specialtyModel).where(eq(specialtyModel.id, id)).returning({
      id: specialtyModel.id,
      name: specialtyModel.name
    })

    return rows.at(0)
  }
}
