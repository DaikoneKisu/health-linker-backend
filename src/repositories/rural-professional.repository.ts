import { count, eq, like, or } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { ruralProfessionalModel } from '@/models/rural-professional.model'
import {
  RuralProfessional,
  NewRuralProfessional,
  UpdateRuralProfessional
} from '@/types/rural-professional.type'
import { userModel } from '@/models/user.model'
import { clinicalCaseModel } from '@/models/clinical-case.model'

export class RuralProfessionalRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll() {
    return await this._db
      .select({
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone
      })
      .from(ruralProfessionalModel)
  }

  public async findAllAdmin(query: string) {
    const caseCountSubquery = this._db
      .select({
        userDocument: clinicalCaseModel.ruralProfessionalDocument,
        caseCount: count(clinicalCaseModel.id).as('caseCount')
      })
      .from(clinicalCaseModel)
      .groupBy(clinicalCaseModel.ruralProfessionalDocument)
      .as('caseCountSubquery')

    return await this._db
      .select({
        fullName: userModel.fullName,
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone,
        email: userModel.email,
        caseCount: caseCountSubquery.caseCount
      })
      .from(ruralProfessionalModel)
      .innerJoin(userModel, eq(userModel.document, ruralProfessionalModel.document))
      .leftJoin(
        caseCountSubquery,
        eq(caseCountSubquery.userDocument, ruralProfessionalModel.document)
      )
      .where(
        or(
          like(userModel.fullName, `%${query}%`),
          like(userModel.email, `%${query}%`),
          like(ruralProfessionalModel.document, `%${query}%`),
          like(ruralProfessionalModel.zone, `%${query}%`)
        )
      )
  }

  public async findWithLimitAndOffset(limit: number, offset: number) {
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

  public async find(document: RuralProfessional['document']) {
    const caseCountSubquery = this._db
      .select({
        userDocument: clinicalCaseModel.ruralProfessionalDocument,
        caseCount: count(clinicalCaseModel.id).as('caseCount')
      })
      .from(clinicalCaseModel)
      .groupBy(clinicalCaseModel.ruralProfessionalDocument)
      .as('caseCountSubquery')

    const rows = await this._db
      .select({
        fullName: userModel.fullName,
        document: ruralProfessionalModel.document,
        zone: ruralProfessionalModel.zone,
        email: userModel.email,
        caseCount: caseCountSubquery.caseCount
      })
      .from(ruralProfessionalModel)
      .innerJoin(userModel, eq(userModel.document, ruralProfessionalModel.document))
      .leftJoin(
        caseCountSubquery,
        eq(caseCountSubquery.userDocument, ruralProfessionalModel.document)
      )
      .where(eq(ruralProfessionalModel.document, document))

    return rows.at(0)
  }

  public async create(newRuralProfessional: NewRuralProfessional) {
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
  ) {
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

  public async delete(document: RuralProfessional['document']) {
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
