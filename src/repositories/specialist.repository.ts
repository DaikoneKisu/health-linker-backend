import { eq } from 'drizzle-orm'
import { specialistModel } from '@/models/specialist.model'
import { pgDatabase } from '@/pg-database'
import { PgDatabase } from '@/types/pg-database.type'
import {
  FindSpecialist,
  NewSpecialist,
  Specialist,
  UpdateSpecialist
} from '@/types/specialist.type'

export class SpecialistRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindSpecialist[]> {
    return await this._db
      .select({
        document: specialistModel.document,
        specialtyId: specialistModel.specialtyId
      })
      .from(specialistModel)
  }

  public async findWithLimitAndOffset(limit: number, offset: number): Promise<FindSpecialist[]> {
    const rows = await this._db
      .select({
        document: specialistModel.document,
        specialtyId: specialistModel.specialtyId
      })
      .from(specialistModel)
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async find(document: Specialist['document']): Promise<FindSpecialist | undefined> {
    const rows = await this._db
      .select({
        document: specialistModel.document,
        specialtyId: specialistModel.specialtyId
      })
      .from(specialistModel)
      .where(eq(specialistModel.document, document))

    return rows.at(0)
  }

  public async create(newSpecialist: NewSpecialist): Promise<FindSpecialist | undefined> {
    const rows = await this._db.insert(specialistModel).values(newSpecialist).returning({
      document: specialistModel.document,
      specialtyId: specialistModel.specialtyId
    })

    return rows.at(0)
  }

  public async update(
    document: Specialist['document'],
    updateSpecialist: UpdateSpecialist
  ): Promise<FindSpecialist | undefined> {
    const rows = await this._db
      .update(specialistModel)
      .set(updateSpecialist)
      .where(eq(specialistModel.document, document))
      .returning({
        document: specialistModel.document,
        specialtyId: specialistModel.specialtyId
      })

    return rows.at(0)
  }

  public async delete(document: Specialist['document']): Promise<FindSpecialist | undefined> {
    const rows = await this._db
      .delete(specialistModel)
      .where(eq(specialistModel.document, document))
      .returning({
        document: specialistModel.document,
        specialtyId: specialistModel.specialtyId
      })

    return rows.at(0)
  }
}
