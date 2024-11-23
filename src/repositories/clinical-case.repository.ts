import { eq, and, isNull, sql, like, or, desc } from 'drizzle-orm'

import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { clinicalCaseModel } from '@/models/clinical-case.model'
import { ClinicalCase, NewClinicalCase, UpdateClinicalCase } from '@/types/clinical-case.type'
import { RuralProfessional } from '@/types/rural-professional.type'

export class ClinicalCaseRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(query = '') {
    return await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(
        or(
          like(clinicalCaseModel.patientReason, `%${query}%`),
          like(clinicalCaseModel.patientAssessment, `%${query}%`),
          like(clinicalCaseModel.description, `%${query}%`)
        )
      )
  }

  public async findWithLimitAndOffset(limit: number, offset: number) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async findOpenWithLimitAndOffset(limit: number, offset: number, query: string) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(
        and(
          eq(clinicalCaseModel.isClosed, false),
          or(
            like(clinicalCaseModel.patientReason, `%${query}%`),
            like(clinicalCaseModel.patientAssessment, `%${query}%`),
            like(clinicalCaseModel.description, `%${query}%`)
          )
        )
      )
      .orderBy(desc(clinicalCaseModel.createdAt))
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async findClosedWithLimitAndOffset(limit: number, offset: number, query: string) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(
        and(
          eq(clinicalCaseModel.isClosed, true),
          or(
            like(clinicalCaseModel.patientReason, `%${query}%`),
            like(clinicalCaseModel.patientAssessment, `%${query}%`),
            like(clinicalCaseModel.description, `%${query}%`)
          )
        )
      )
      .orderBy(desc(clinicalCaseModel.createdAt))
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async find(id: ClinicalCase['id']) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(eq(clinicalCaseModel.id, id))

    return rows.at(0)
  }

  public async findByIsClosedAndRuralProfessional(
    isClosed: ClinicalCase['isClosed'],
    ruralProfessionalDocument: RuralProfessional['document']
  ) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(
        and(
          eq(clinicalCaseModel.isClosed, isClosed),
          eq(clinicalCaseModel.ruralProfessionalDocument, ruralProfessionalDocument),
          isNull(clinicalCaseModel.errasedAt)
        )
      )

    return rows
  }

  public async findByIsClosedAndRuralProfessionalWithLimitAndOffset(
    limit: number,
    offset: number,
    isClosed: ClinicalCase['isClosed'],
    ruralProfessionalDocument: RuralProfessional['document'],
    query: string
  ) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument,
        editable:
          sql`CASE WHEN (NOW() - ${clinicalCaseModel.createdAt}) < INTERVAL '30 minutes' THEN true ELSE false END`.as(
            'editable'
          )
      })
      .from(clinicalCaseModel)
      .where(
        and(
          eq(clinicalCaseModel.isClosed, isClosed),
          eq(clinicalCaseModel.ruralProfessionalDocument, ruralProfessionalDocument),

          isNull(clinicalCaseModel.errasedAt),

          or(
            like(clinicalCaseModel.patientReason, `%${query}%`),
            like(clinicalCaseModel.patientAssessment, `%${query}%`),
            like(clinicalCaseModel.description, `%${query}%`)
          )
        )
      )
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async findByRuralProfessionalWithLimitAndOffset(
    limit: number,
    offset: number,
    ruralProfessionalDocument: RuralProfessional['document']
  ) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(eq(clinicalCaseModel.ruralProfessionalDocument, ruralProfessionalDocument))
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async findByIsPublicWithLimitAndOffset(
    limit: number,
    offset: number,
    isPublic: ClinicalCase['isPublic'],
    query: string
  ) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(
        and(
          eq(clinicalCaseModel.isPublic, isPublic),
          or(
            like(clinicalCaseModel.patientReason, `%${query}%`),
            like(clinicalCaseModel.patientAssessment, `%${query}%`),
            like(clinicalCaseModel.description, `%${query}%`)
          )
        )
      )
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async findByIsClosedAndRequiredSpecialtyWithLimitAndOffset(
    limit: number,
    offset: number,
    isClosed: ClinicalCase['isClosed'],
    requiredSpecialtyId: ClinicalCase['requiredSpecialtyId'],
    query: string
  ) {
    const rows = await this._db
      .select({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })
      .from(clinicalCaseModel)
      .where(
        and(
          eq(clinicalCaseModel.requiredSpecialtyId, requiredSpecialtyId),
          eq(clinicalCaseModel.isClosed, isClosed),
          or(
            like(clinicalCaseModel.patientAssessment, `%${query}%`),
            like(clinicalCaseModel.patientReason, `%${query}%`),
            like(clinicalCaseModel.description, `%${query}%`)
          ),
          isNull(clinicalCaseModel.errasedAt)
        )
      )
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async create(newClinicalCase: NewClinicalCase) {
    const rows = await this._db.insert(clinicalCaseModel).values(newClinicalCase).returning({
      id: clinicalCaseModel.id,
      description: clinicalCaseModel.description,
      reason: clinicalCaseModel.reason,
      isPublic: clinicalCaseModel.isPublic,
      isClosed: clinicalCaseModel.isClosed,
      patientBirthdate: clinicalCaseModel.patientBirthdate,
      patientGender: clinicalCaseModel.patientGender,
      patientReason: clinicalCaseModel.patientReason,
      patientAssessment: clinicalCaseModel.patientAssessment,
      requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
      ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
    })

    return rows.at(0)
  }

  public async update(id: ClinicalCase['id'], updateClinicalCase: UpdateClinicalCase) {
    const rows = await this._db
      .update(clinicalCaseModel)
      .set(updateClinicalCase)
      .where(eq(clinicalCaseModel.id, id))
      .returning({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })

    return rows.at(0)
  }

  public async delete(id: ClinicalCase['id']) {
    const rows = await this._db
      .delete(clinicalCaseModel)
      .where(eq(clinicalCaseModel.id, id))
      .returning({
        id: clinicalCaseModel.id,
        description: clinicalCaseModel.description,
        reason: clinicalCaseModel.reason,
        isPublic: clinicalCaseModel.isPublic,
        isClosed: clinicalCaseModel.isClosed,
        patientBirthdate: clinicalCaseModel.patientBirthdate,
        patientGender: clinicalCaseModel.patientGender,
        patientReason: clinicalCaseModel.patientReason,
        patientAssessment: clinicalCaseModel.patientAssessment,
        requiredSpecialtyId: clinicalCaseModel.requiredSpecialtyId,
        ruralProfessionalDocument: clinicalCaseModel.ruralProfessionalDocument
      })

    return rows.at(0)
  }
}
