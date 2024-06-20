import { eq, and } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { clinicalCaseModel } from '@/models/clinical-case.model'
import {
  ClinicalCase,
  NewClinicalCase,
  FindClinicalCase,
  UpdateClinicalCase
} from '@/types/clinical-case.type'
import { RuralProfessional } from '@/types/rural-professional.type'

export class ClinicalCaseRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindClinicalCase[]> {
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
  }

  public async findWithLimitAndOffset(limit: number, offset: number): Promise<FindClinicalCase[]> {
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

  public async find(id: ClinicalCase['id']): Promise<FindClinicalCase | undefined> {
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
  ): Promise<FindClinicalCase[] | undefined> {
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
          eq(clinicalCaseModel.ruralProfessionalDocument, ruralProfessionalDocument)
        )
      )

    return rows
  }

  public async findByIsClosedAndRuralProfessionalWithLimitAndOffset(
    limit: number,
    offset: number,
    isClosed: ClinicalCase['isClosed'],
    ruralProfessionalDocument: RuralProfessional['document']
  ): Promise<FindClinicalCase[] | undefined> {
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
          eq(clinicalCaseModel.ruralProfessionalDocument, ruralProfessionalDocument)
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
  ): Promise<FindClinicalCase[] | undefined> {
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
    isPublic: ClinicalCase['isPublic']
  ): Promise<FindClinicalCase[] | undefined> {
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
      .where(eq(clinicalCaseModel.isPublic, isPublic))
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async findByIsClosedAndRequiredSpecialtyWithLimitAndOffset(
    limit: number,
    offset: number,
    isClosed: ClinicalCase['isClosed'],
    requiredSpecialtyId: ClinicalCase['requiredSpecialtyId']
  ): Promise<FindClinicalCase[] | undefined> {
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
          eq(clinicalCaseModel.isClosed, isClosed)
        )
      )
      .limit(limit)
      .offset(limit * offset)

    return rows
  }

  public async create(newClinicalCase: NewClinicalCase): Promise<FindClinicalCase | undefined> {
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

  public async update(
    id: ClinicalCase['id'],
    updateClinicalCase: UpdateClinicalCase
  ): Promise<FindClinicalCase | undefined> {
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

  public async delete(id: ClinicalCase['id']): Promise<FindClinicalCase | undefined> {
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
