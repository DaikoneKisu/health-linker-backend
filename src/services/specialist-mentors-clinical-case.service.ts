import { CreateSpecialistMentorsClinicalCaseDto } from '@/dtos/specialist-mentors-clinical-case.dto'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import {
  FindSpecialistMentorsClinicalCase,
  NewSpecialistMentorsClinicalCase,
  SpecialistMentorsClinicalCase
} from '@/types/specialist-mentors-clinical-case.type'
import { ClinicalCaseService } from './clinical-case.service'
import { SpecialistService } from './specialist.service'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'
import { ClinicalCase } from '@/types/clinical-case.type'
import { Specialist } from '@/types/specialist.type'

export class SpecialistMentorsClinicalCaseService {
  private readonly _specialistMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository
  private readonly _clinicalCaseService: ClinicalCaseService
  private readonly _specialistService: SpecialistService

  constructor(
    specialistMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository,
    clinicalCaseService: ClinicalCaseService,
    specialistService: SpecialistService
  ) {
    this._specialistMentorsClinicalCaseRepository = specialistMentorsClinicalCaseRepository
    this._clinicalCaseService = clinicalCaseService
    this._specialistService = specialistService
  }

  public async getAll(): Promise<FindSpecialistMentorsClinicalCase[]> {
    return await this._specialistMentorsClinicalCaseRepository.findAll()
  }

  public async get(
    clinicalCaseId: SpecialistMentorsClinicalCase['clinicalCaseId'],
    specialistDocument: SpecialistMentorsClinicalCase['specialistDocument']
  ): Promise<FindSpecialistMentorsClinicalCase | undefined> {
    return await this._specialistMentorsClinicalCaseRepository.find(
      clinicalCaseId,
      specialistDocument
    )
  }

  public async getMentors(clinicalCaseId: ClinicalCase['id']) {
    const clinicalCase = await this._clinicalCaseService.getClinicalCase(clinicalCaseId)

    if (!clinicalCase) {
      throw new UnprocessableContentError('El caso clínico proveído no existe.')
    }

    return await this._specialistMentorsClinicalCaseRepository.findManyByClinicalCase(
      clinicalCase.id
    )
  }

  public async getCases(specialistDocument: Specialist['document']) {
    const specialist = await this._specialistService.getSpecialist(specialistDocument)

    if (!specialist) {
      throw new UnprocessableContentError('El especialista proveído no existe.')
    }

    return await this._specialistMentorsClinicalCaseRepository.findManyBySpecialist(
      specialist.document
    )
  }

  public async create(
    createSpecialistMentorsClinicalCase: CreateSpecialistMentorsClinicalCaseDto
  ): Promise<FindSpecialistMentorsClinicalCase | undefined> {
    const specialist = await this._specialistService.getSpecialist(
      createSpecialistMentorsClinicalCase.specialistDocument
    )

    if (!specialist) {
      throw new UnprocessableContentError('El especialista proveído no existe.')
    }

    const clinicalCase = await this._clinicalCaseService.getClinicalCase(
      createSpecialistMentorsClinicalCase.clinicalCaseId
    )

    if (!clinicalCase) {
      throw new UnprocessableContentError('El caso clínico proveído no existe.')
    }

    if (specialist.specialtyId !== clinicalCase.requiredSpecialtyId) {
      throw new UnprocessableContentError(
        'El especialista proveído no tiene la especialidad requerida por el caso clínico proveído.'
      )
    }

    const newSpecialistMentorsClinicalCase: NewSpecialistMentorsClinicalCase = {
      clinicalCaseId: createSpecialistMentorsClinicalCase.clinicalCaseId,
      specialistDocument: createSpecialistMentorsClinicalCase.specialistDocument
    }

    return await this._specialistMentorsClinicalCaseRepository.create(
      newSpecialistMentorsClinicalCase
    )
  }

  public async delete(
    clinicalCaseId: SpecialistMentorsClinicalCase['clinicalCaseId'],
    specialistDocument: SpecialistMentorsClinicalCase['specialistDocument']
  ) {
    return await this._specialistMentorsClinicalCaseRepository.delete(
      clinicalCaseId,
      specialistDocument
    )
  }
}
