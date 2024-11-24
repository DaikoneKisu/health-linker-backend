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
import { type ClinicalCase } from '@/types/clinical-case.type'
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

  public async getPaginatedCases(
    page: number = 1,
    size: number = 10,
    specialistDocument: Specialist['document']
  ) {
    const specialist = await this._specialistService.getSpecialist(specialistDocument)

    if (!specialist) {
      throw new UnprocessableContentError('El especialista proveído no existe.')
    }

    return await this._specialistMentorsClinicalCaseRepository.findManyBySpecialistWithLimitAndOffset(
      size,
      page - 1,
      specialist.document
    )
  }

  public async getPaginatedFindCases(
    page: number = 1,
    size: number = 10,
    specialistDocument: Specialist['document']
  ) {
    const specialist = await this._specialistService.getSpecialist(specialistDocument)

    if (!specialist) {
      throw new UnprocessableContentError('El especialista proveído no existe.')
    }

    const mentoredCases =
      await this._specialistMentorsClinicalCaseRepository.findManyBySpecialistWithLimitAndOffset(
        size,
        page - 1,
        specialist.document
      )

    if (!mentoredCases) {
      return []
    }

    const clinicalCases = []

    for (const mentoredCase of mentoredCases) {
      const clinicalCase = await this._clinicalCaseService.getClinicalCase(
        mentoredCase.clinicalCaseId
      )

      if (!clinicalCase) {
        continue
      }

      clinicalCases.push(clinicalCase)
    }

    return clinicalCases
  }

  public async getOpenPaginatedFindCases(
    page: number = 1,
    size: number = 10,
    specialistDocument: Specialist['document'],
    query = ''
  ) {
    const specialist = await this._specialistService.getSpecialist(specialistDocument)

    if (!specialist) {
      throw new UnprocessableContentError('El especialista proveído no existe.')
    }

    const clinicalCases = await this._clinicalCaseService.getAllClinicalCases(query)

    const mentoredCases =
      await this._specialistMentorsClinicalCaseRepository.findManyBySpecialistWithLimitAndOffset(
        size,
        page - 1,
        specialist.document
      )

    if (!mentoredCases || mentoredCases?.length === 0) {
      return []
    }

    const openMentoredFindClinicalCases = []

    for (const clinicalCase of clinicalCases) {
      for (const mentoredCase of mentoredCases) {
        if (
          clinicalCase.id === mentoredCase.clinicalCaseId &&
          mentoredCase.specialistDocument === specialist.document &&
          !clinicalCase.isClosed
        ) {
          openMentoredFindClinicalCases.push(clinicalCase)
        }
      }
    }

    return openMentoredFindClinicalCases
  }

  public async getClosedPaginatedFindCases(
    page: number = 1,
    size: number = 10,
    specialistDocument: Specialist['document']
  ) {
    const specialist = await this._specialistService.getSpecialist(specialistDocument)

    if (!specialist) {
      throw new UnprocessableContentError('El especialista proveído no existe.')
    }

    const clinicalCases = await this._clinicalCaseService.getAllClinicalCases()

    const mentoredCases =
      await this._specialistMentorsClinicalCaseRepository.findManyBySpecialistWithLimitAndOffset(
        size,
        page - 1,
        specialist.document
      )

    if (!mentoredCases || mentoredCases?.length === 0) {
      return []
    }

    const closedMentoredFindClinicalCases = []

    for (const clinicalCase of clinicalCases) {
      for (const mentoredCase of mentoredCases) {
        if (
          clinicalCase.id === mentoredCase.clinicalCaseId &&
          mentoredCase.specialistDocument === specialist.document &&
          clinicalCase.isClosed
        ) {
          closedMentoredFindClinicalCases.push(clinicalCase)
        }
      }
    }

    return closedMentoredFindClinicalCases
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

    const specialistMentorsClinicalCase = await this._specialistMentorsClinicalCaseRepository.find(
      newSpecialistMentorsClinicalCase.clinicalCaseId,
      newSpecialistMentorsClinicalCase.specialistDocument
    )

    if (specialistMentorsClinicalCase) {
      throw new UnprocessableContentError(
        'El especialista proveído ya es mentor del caso clínico proveído.'
      )
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
