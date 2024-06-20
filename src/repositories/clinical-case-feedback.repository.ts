import { eq, and } from 'drizzle-orm'
import { clinicalCaseFeedbackModel } from '@/models/clinical-case-feedback.model'
import { pgDatabase } from '@/pg-database'
import {
  FindClinicalCaseFeedback,
  NewClinicalCaseFeedback,
  UpdateClinicalCaseFeedback
} from '@/types/clinical-case-feedback.type'
import { PgDatabase } from '@/types/pg-database.type'

export class ClinicalCaseFeedbackRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindClinicalCaseFeedback[]> {
    return await this._db
      .select({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })
      .from(clinicalCaseFeedbackModel)
  }

  public async findWithLimitAndOffset(
    limit: number,
    offset: number
  ): Promise<FindClinicalCaseFeedback[]> {
    const rows = await this._db
      .select({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })
      .from(clinicalCaseFeedbackModel)
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async find(
    id: number,
    clinicalCaseId: number,
    userDocument: string
  ): Promise<FindClinicalCaseFeedback | undefined> {
    const rows = await this._db
      .select({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })
      .from(clinicalCaseFeedbackModel)
      .where(
        and(
          eq(clinicalCaseFeedbackModel.id, id),
          eq(clinicalCaseFeedbackModel.clinicalCaseId, clinicalCaseId),
          eq(clinicalCaseFeedbackModel.userDocument, userDocument)
        )
      )

    return rows.at(0)
  }

  public async findByClinicalCaseWithLimitAndOffset(
    limit: number,
    offset: number,
    clinicalCaseId: number
  ): Promise<FindClinicalCaseFeedback[]> {
    const rows = await this._db
      .select({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })
      .from(clinicalCaseFeedbackModel)
      .where(eq(clinicalCaseFeedbackModel.clinicalCaseId, clinicalCaseId))
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async findByClinicalCase(clinicalCaseId: number): Promise<FindClinicalCaseFeedback[]> {
    const rows = await this._db
      .select({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })
      .from(clinicalCaseFeedbackModel)
      .where(eq(clinicalCaseFeedbackModel.clinicalCaseId, clinicalCaseId))

    return rows
  }

  public async findByUser(userDocument: string): Promise<FindClinicalCaseFeedback[]> {
    const rows = await this._db
      .select({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })
      .from(clinicalCaseFeedbackModel)
      .where(eq(clinicalCaseFeedbackModel.userDocument, userDocument))

    return rows
  }

  public async findByUserWithLimitAndOffset(
    limit: number,
    offset: number,
    userDocument: string
  ): Promise<FindClinicalCaseFeedback[]> {
    const rows = await this._db
      .select({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })
      .from(clinicalCaseFeedbackModel)
      .where(eq(clinicalCaseFeedbackModel.userDocument, userDocument))
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async create(
    newClinicalCaseFeedback: NewClinicalCaseFeedback
  ): Promise<FindClinicalCaseFeedback | undefined> {
    const rows = await this._db
      .insert(clinicalCaseFeedbackModel)
      .values(newClinicalCaseFeedback)
      .returning({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })

    return rows.at(0)
  }

  public async update(
    id: number,
    clinicalCaseId: number,
    userDocument: string,
    updateClinicalCaseFeedback: UpdateClinicalCaseFeedback
  ): Promise<FindClinicalCaseFeedback | undefined> {
    const rows = await this._db
      .update(clinicalCaseFeedbackModel)
      .set(updateClinicalCaseFeedback)
      .where(
        and(
          eq(clinicalCaseFeedbackModel.id, id),
          eq(clinicalCaseFeedbackModel.clinicalCaseId, clinicalCaseId),
          eq(clinicalCaseFeedbackModel.userDocument, userDocument)
        )
      )
      .returning({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })

    return rows.at(0)
  }

  public async delete(
    id: number,
    clinicalCaseId: number,
    userDocument: string
  ): Promise<FindClinicalCaseFeedback | undefined> {
    const rows = await this._db
      .delete(clinicalCaseFeedbackModel)
      .where(
        and(
          eq(clinicalCaseFeedbackModel.id, id),
          eq(clinicalCaseFeedbackModel.clinicalCaseId, clinicalCaseId),
          eq(clinicalCaseFeedbackModel.userDocument, userDocument)
        )
      )
      .returning({
        id: clinicalCaseFeedbackModel.id,
        clinicalCaseId: clinicalCaseFeedbackModel.clinicalCaseId,
        userDocument: clinicalCaseFeedbackModel.userDocument,
        text: clinicalCaseFeedbackModel.text,
        createdAt: clinicalCaseFeedbackModel.createdAt,
        updatedAt: clinicalCaseFeedbackModel.updatedAt
      })

    return rows.at(0)
  }
}
