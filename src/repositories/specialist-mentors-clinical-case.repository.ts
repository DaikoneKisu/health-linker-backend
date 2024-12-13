import { eq, and, countDistinct, gt } from 'drizzle-orm'
import { specialistMentorsClinicalCaseModel } from '@/models/specialist-mentors-clinical-case.model'
import { pgDatabase } from '@/pg-database'
import { PgDatabase } from '@/types/pg-database.type'
import {
  FindSpecialistMentorsClinicalCase,
  NewSpecialistMentorsClinicalCase,
  SpecialistMentorsClinicalCase,
  UpdateSpecialistMentorsClinicalCase
} from '@/types/specialist-mentors-clinical-case.type'
import { ClinicalCase } from '@/types/clinical-case.type'
import { User } from '@/types/user.type'

export class SpecialistMentorsClinicalCaseRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindSpecialistMentorsClinicalCase[]> {
    return await this._db
      .select({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })
      .from(specialistMentorsClinicalCaseModel)
  }

  public async find(
    clinicalCaseId: SpecialistMentorsClinicalCase['clinicalCaseId'],
    specialistDocument: SpecialistMentorsClinicalCase['specialistDocument']
  ): Promise<FindSpecialistMentorsClinicalCase | undefined> {
    const rows = await this._db
      .select({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })
      .from(specialistMentorsClinicalCaseModel)
      .where(
        and(
          eq(specialistMentorsClinicalCaseModel.clinicalCaseId, clinicalCaseId),
          eq(specialistMentorsClinicalCaseModel.specialistDocument, specialistDocument)
        )
      )

    return rows.at(0)
  }

  public async findManyByClinicalCase(
    clinicalCaseId: SpecialistMentorsClinicalCase['clinicalCaseId']
  ): Promise<FindSpecialistMentorsClinicalCase[] | undefined> {
    return await this._db
      .select({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })
      .from(specialistMentorsClinicalCaseModel)
      .where(eq(specialistMentorsClinicalCaseModel.clinicalCaseId, clinicalCaseId))
  }

  public async findManyBySpecialist(
    specialistDocument: SpecialistMentorsClinicalCase['specialistDocument']
  ): Promise<FindSpecialistMentorsClinicalCase[] | undefined> {
    return await this._db
      .select({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })
      .from(specialistMentorsClinicalCaseModel)
      .where(eq(specialistMentorsClinicalCaseModel.specialistDocument, specialistDocument))
  }

  public async findManyBySpecialistWithLimitAndOffset(
    limit: number,
    offset: number,
    specialistDocument: SpecialistMentorsClinicalCase['specialistDocument']
  ): Promise<FindSpecialistMentorsClinicalCase[] | undefined> {
    return await this._db
      .select({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })
      .from(specialistMentorsClinicalCaseModel)
      .where(eq(specialistMentorsClinicalCaseModel.specialistDocument, specialistDocument))
      .limit(limit)
      .offset(limit * offset)
  }

  public async findCountNotSeen(specialistDocument: User['document'], lastOnlineDate: Date) {
    const cases = await this._db
      .select({ count: countDistinct(specialistMentorsClinicalCaseModel.clinicalCaseId) })
      .from(specialistMentorsClinicalCaseModel)
      .where(
        and(
          eq(specialistMentorsClinicalCaseModel.specialistDocument, specialistDocument),
          gt(specialistMentorsClinicalCaseModel.createdAt, lastOnlineDate)
        )
      )

    return cases.at(0)?.count
  }

  public async create(
    newSpecialistMentorsClinicalCase: NewSpecialistMentorsClinicalCase
  ): Promise<FindSpecialistMentorsClinicalCase | undefined> {
    const rows = await this._db
      .insert(specialistMentorsClinicalCaseModel)
      .values(newSpecialistMentorsClinicalCase)
      .returning({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })

    return rows.at(0)
  }

  public async update(
    clinicalCaseId: SpecialistMentorsClinicalCase['clinicalCaseId'],
    specialistDocument: SpecialistMentorsClinicalCase['specialistDocument'],
    updateSpecialistMentorsClinicalCase: UpdateSpecialistMentorsClinicalCase
  ): Promise<FindSpecialistMentorsClinicalCase | undefined> {
    const rows = await this._db
      .update(specialistMentorsClinicalCaseModel)
      .set(updateSpecialistMentorsClinicalCase)
      .where(
        and(
          eq(specialistMentorsClinicalCaseModel.clinicalCaseId, clinicalCaseId),
          eq(specialistMentorsClinicalCaseModel.specialistDocument, specialistDocument)
        )
      )
      .returning({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })

    return rows.at(0)
  }

  public async delete(
    clinicalCaseId: SpecialistMentorsClinicalCase['clinicalCaseId'],
    specialistDocument: SpecialistMentorsClinicalCase['specialistDocument']
  ): Promise<FindSpecialistMentorsClinicalCase | undefined> {
    const rows = await this._db
      .delete(specialistMentorsClinicalCaseModel)
      .where(
        and(
          eq(specialistMentorsClinicalCaseModel.clinicalCaseId, clinicalCaseId),
          eq(specialistMentorsClinicalCaseModel.specialistDocument, specialistDocument)
        )
      )
      .returning({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })

    return rows.at(0)
  }

  public async deleteAllFromCase(clinicalCaseId: ClinicalCase['id']) {
    const rows = await this._db
      .delete(specialistMentorsClinicalCaseModel)
      .where(eq(specialistMentorsClinicalCaseModel.clinicalCaseId, clinicalCaseId))
      .returning({
        clinicalCaseId: specialistMentorsClinicalCaseModel.clinicalCaseId,
        specialistDocument: specialistMentorsClinicalCaseModel.specialistDocument
      })

    return rows
  }
}
