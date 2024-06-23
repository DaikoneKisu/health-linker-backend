import { eq } from 'drizzle-orm'
import { clinicalCaseFileModel } from '@/models/clinical-case-file.model'
import { pgDatabase } from '@/pg-database'
import {
  FindClinicalCaseFile,
  NewClinicalCaseFile,
  UpdateClinicalCaseFile
} from '@/types/clinical-case-file.type'
import { PgDatabase } from '@/types/pg-database.type'

export class ClinicalCaseFileRepository {
  private readonly _db: PgDatabase = pgDatabase

  public async findAll(): Promise<FindClinicalCaseFile[]> {
    return await this._db
      .select({
        id: clinicalCaseFileModel.id,
        link: clinicalCaseFileModel.link,
        clinicalCaseId: clinicalCaseFileModel.clinicalCaseId
      })
      .from(clinicalCaseFileModel)
  }

  public async find(id: number): Promise<FindClinicalCaseFile | undefined> {
    const rows = await this._db
      .select({
        id: clinicalCaseFileModel.id,
        link: clinicalCaseFileModel.link,
        clinicalCaseId: clinicalCaseFileModel.clinicalCaseId
      })
      .from(clinicalCaseFileModel)
      .where(eq(clinicalCaseFileModel.id, id))

    return rows.at(0)
  }

  public async findByClinicalCase(clinicalCaseId: number): Promise<FindClinicalCaseFile[]> {
    return await this._db
      .select({
        id: clinicalCaseFileModel.id,
        link: clinicalCaseFileModel.link,
        clinicalCaseId: clinicalCaseFileModel.clinicalCaseId
      })
      .from(clinicalCaseFileModel)
      .where(eq(clinicalCaseFileModel.clinicalCaseId, clinicalCaseId))
  }

  public async create(
    newClinicalCaseFile: NewClinicalCaseFile
  ): Promise<FindClinicalCaseFile | undefined> {
    const rows = await this._db
      .insert(clinicalCaseFileModel)
      .values(newClinicalCaseFile)
      .returning({
        id: clinicalCaseFileModel.id,
        link: clinicalCaseFileModel.link,
        clinicalCaseId: clinicalCaseFileModel.clinicalCaseId
      })

    return rows.at(0)
  }

  public async update(
    id: number,
    updateClinicalCaseFile: UpdateClinicalCaseFile
  ): Promise<FindClinicalCaseFile | undefined> {
    const rows = await this._db
      .update(clinicalCaseFileModel)
      .set(updateClinicalCaseFile)
      .where(eq(clinicalCaseFileModel.id, id))
      .returning({
        id: clinicalCaseFileModel.id,
        link: clinicalCaseFileModel.link,
        clinicalCaseId: clinicalCaseFileModel.clinicalCaseId
      })

    return rows.at(0)
  }

  public async delete(id: number): Promise<FindClinicalCaseFile | undefined> {
    const rows = await this._db
      .delete(clinicalCaseFileModel)
      .where(eq(clinicalCaseFileModel.id, id))
      .returning({
        id: clinicalCaseFileModel.id,
        link: clinicalCaseFileModel.link,
        clinicalCaseId: clinicalCaseFileModel.clinicalCaseId
      })

    return rows.at(0)
  }
}
