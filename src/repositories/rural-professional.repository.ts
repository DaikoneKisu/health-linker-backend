import { eq } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { ruralProfessionalModel } from '@/models/rural-professional.model'
import {
  RuralProfessional,
  FindRuralProfessional,
  NewRuralProfessional,
  UpdateRuralProfessional
} from '@/types/rural-professional.type'

export class RuralProfessionalRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindRuralProfessional[]> {
    return await this._db
      .select({
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone
      })
      .from(ruralProfessionalModel)
  }

  public async findWithLimitAndOffset(
    limit: number,
    offset: number
  ): Promise<FindRuralProfessional[]> {
    const rows = await this._db
      .select({
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone
      })
      .from(ruralProfessionalModel)
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async find(
    document: RuralProfessional['document']
  ): Promise<FindRuralProfessional | undefined> {
    const rows = await this._db
      .select({
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone
      })
      .from(ruralProfessionalModel)
      .where(eq(ruralProfessionalModel.document, document))

    return rows.at(0)
  }

  public async create(
    newRuralProfessional: NewRuralProfessional
  ): Promise<FindRuralProfessional | undefined> {
    const rows = await this._db
      .insert(ruralProfessionalModel)
      .values(newRuralProfessional)
      .returning({
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone
      })

    return rows.at(0)
  }

  public async update(
    document: RuralProfessional['document'],
    updateRuralProfessional: UpdateRuralProfessional
  ): Promise<FindRuralProfessional | undefined> {
    const rows = await this._db
      .update(ruralProfessionalModel)
      .set(updateRuralProfessional)
      .where(eq(ruralProfessionalModel.document, document))
      .returning({
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone
      })

    return rows.at(0)
  }

  public async delete(
    document: RuralProfessional['document']
  ): Promise<FindRuralProfessional | undefined> {
    const rows = await this._db
      .delete(ruralProfessionalModel)
      .where(eq(ruralProfessionalModel.document, document))
      .returning({
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone
      })

    return rows.at(0)
  }
}
