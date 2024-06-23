import { DOMAIN, PUBLIC_PATH } from '@/config/env'
import { CreateClinicalCaseFileDto } from '@/dtos/clinical-case-file.dto'
import { ClinicalCaseFileRepository } from '@/repositories/clinical-case-file.repository'
import { NewClinicalCaseFile } from '@/types/clinical-case-file.type'
import { File } from '@/types/file.type'
import { deleteFileFromPublic } from '@/utils/delete-file-from-public'
import { InternalServerError, NotFoundError } from 'routing-controllers'

export class ClinicalCaseFileService {
  private readonly _clinicalCaseFileRepository: ClinicalCaseFileRepository

  constructor(clinicalCaseFileRepository: ClinicalCaseFileRepository) {
    this._clinicalCaseFileRepository = clinicalCaseFileRepository
  }

  public async getAll() {
    return await this._clinicalCaseFileRepository.findAll()
  }

  public async getByClinicalCase(clinicalCaseId: number) {
    return await this._clinicalCaseFileRepository.findByClinicalCase(clinicalCaseId)
  }

  public async create(createClinicalCaseFileDto: CreateClinicalCaseFileDto, file: File) {
    const newClinicalCaseFile: NewClinicalCaseFile = {
      link: `${DOMAIN}/${PUBLIC_PATH}/${file.filename}`,
      clinicalCaseId: Number(createClinicalCaseFileDto.clinicalCaseId)
    }

    return await this._clinicalCaseFileRepository.create(newClinicalCaseFile)
  }

  public async delete(id: number) {
    const clinicalCaseFile = await this._clinicalCaseFileRepository.find(id)

    if (!clinicalCaseFile) {
      throw new NotFoundError('El archivo de id proveído no existe.')
    }

    const filename = clinicalCaseFile.link.split('/').pop()

    if (!filename) {
      throw new InternalServerError('')
    }

    //TODO: This is asynchronous, so it should be checked if file was deleted before deleting the row from the db
    deleteFileFromPublic(filename)

    return await this._clinicalCaseFileRepository.delete(id)
  }
}
