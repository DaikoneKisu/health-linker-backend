import { count, eq, like, or } from 'drizzle-orm'
import { specialistModel } from '@/models/specialist.model'
import { pgDatabase } from '@/pg-database'
import { PgDatabase } from '@/types/pg-database.type'
import {
  FindSpecialist,
  NewSpecialist,
  Specialist,
  UpdateSpecialist
} from '@/types/specialist.type'
import { specialtyModel } from '@/models/specialty.model'
import { userModel } from '@/models/user.model'
import { clinicalCaseFeedbackModel } from '@/models/clinical-case-feedback.model'

export class SpecialistRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll() {
    return await this._db
      .select({
        document: specialistModel.document,
        specialtyId: specialistModel.specialtyId
      })
      .from(specialistModel)
  }

  public async findAllAdmin(query: string) {
    const feedbackCountSubquery = this._db
      .select({
        userDocument: clinicalCaseFeedbackModel.userDocument,
        feedbackCount: count(clinicalCaseFeedbackModel.clinicalCaseId).as('feedbackCount')
      })
      .from(clinicalCaseFeedbackModel)
      .groupBy(clinicalCaseFeedbackModel.userDocument)
      .as('feedbackCountSubquery')

    return await this._db
      .select({
        fullName: userModel.fullName,
        document: specialistModel.document,
        speciality: specialtyModel.name,
        email: userModel.email,
        feedbackCount: feedbackCountSubquery.feedbackCount
      })
      .from(specialistModel)
      .innerJoin(specialtyModel, eq(specialtyModel.id, specialistModel.specialtyId))
      .innerJoin(userModel, eq(userModel.document, specialistModel.document))
      .leftJoin(
        feedbackCountSubquery,
        eq(feedbackCountSubquery.userDocument, specialistModel.document)
      )
      .where(
        or(
          like(userModel.fullName, `%${query}%`),
          like(userModel.email, `%${query}%`),
          like(specialistModel.document, `%${query}%`),
          like(specialtyModel.name, `%${query}%`)
        )
      )
  }

  public async findWithLimitAndOffset(limit: number, offset: number) {
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

  public async find(document: Specialist['document']) {
    const feedbackCountSubquery = this._db
      .select({
        userDocument: clinicalCaseFeedbackModel.userDocument,
        feedbackCount: count(clinicalCaseFeedbackModel.clinicalCaseId).as('feedbackCount')
      })
      .from(clinicalCaseFeedbackModel)
      .groupBy(clinicalCaseFeedbackModel.userDocument)
      .as('feedbackCountSubquery')

    const rows = await this._db
      .select({
        fullName: userModel.fullName,
        document: specialistModel.document,
        specialtyId: specialistModel.specialtyId,
        speciality: specialtyModel.name,
        email: userModel.email,
        feedbackCount: feedbackCountSubquery.feedbackCount
      })
      .from(specialistModel)
      .innerJoin(specialtyModel, eq(specialtyModel.id, specialistModel.specialtyId))
      .innerJoin(userModel, eq(userModel.document, specialistModel.document))
      .leftJoin(
        feedbackCountSubquery,
        eq(feedbackCountSubquery.userDocument, specialistModel.document)
      )
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
