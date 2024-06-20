import { FindUser } from '@/types/find-user.type'
import { ClinicalCaseService } from './clinical-case.service'
import { SpecialistMentorsClinicalCaseService } from './specialist-mentors-clinical-case.service'
import { RuralProfessionalService } from './rural-professional.service'
import { SpecialistService } from './specialist.service'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'
import { FindClinicalCase } from '@/types/clinical-case.type'

export class ClinicalCasesRecordService {
  private readonly _clinicalCaseService: ClinicalCaseService
  private readonly _specialistMentorsClinicalCaseService: SpecialistMentorsClinicalCaseService
  private readonly _ruralProfessionalService: RuralProfessionalService
  private readonly _specialistService: SpecialistService

  constructor(
    clinicalCaseService: ClinicalCaseService,
    specialistMentorsClinicalCaseService: SpecialistMentorsClinicalCaseService,
    ruralProfessionalService: RuralProfessionalService,
    specialistService: SpecialistService
  ) {
    this._clinicalCaseService = clinicalCaseService
    this._specialistMentorsClinicalCaseService = specialistMentorsClinicalCaseService
    this._ruralProfessionalService = ruralProfessionalService
    this._specialistService = specialistService
  }

  public async getRecord(user: FindUser) {
    if (user.userType === 'rural professional') {
      const ruralProfessional = await this._ruralProfessionalService.getRuralProfessional(
        user.document
      )

      if (!ruralProfessional) {
        throw new UnprocessableContentError('El profesional rural proveído no existe.')
      }

      return await this._clinicalCaseService.getOpenOrClosedRuralProfessionalClinicalCases(
        true,
        ruralProfessional.document
      )
    }

    if (user.userType === 'specialist') {
      const specialist = await this._specialistService.getSpecialist(user.document)

      if (!specialist) {
        throw new UnprocessableContentError('El especialista proveído no existe.')
      }

      const mentoredCases = await this._specialistMentorsClinicalCaseService.getCases(
        specialist.document
      )

      if (!mentoredCases) {
        return []
      }

      const closedClinicalCases: FindClinicalCase[] = []

      for (const mentoredCase of mentoredCases) {
        const clinicalCase = await this._clinicalCaseService.getClinicalCase(
          mentoredCase.clinicalCaseId
        )

        if (!clinicalCase || !clinicalCase.isClosed) {
          continue
        }

        closedClinicalCases.push(clinicalCase)
      }

      return closedClinicalCases
    }

    throw new UnprocessableContentError(
      'Solo los profesionales rurales y especialistas pueden acceder al histórico de sus casos clínicos.'
    )
  }

  public async getPaginatedRecord(page: number = 1, size: number = 10, user: FindUser) {
    if (user.userType === 'rural professional') {
      const ruralProfessional = await this._ruralProfessionalService.getRuralProfessional(
        user.document
      )

      if (!ruralProfessional) {
        throw new UnprocessableContentError('El profesional rural proveído no existe.')
      }

      return await this._clinicalCaseService.getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
        size,
        page,
        true,
        ruralProfessional.document
      )
    }

    if (user.userType === 'specialist') {
      const specialist = await this._specialistService.getSpecialist(user.document)

      if (!specialist) {
        throw new UnprocessableContentError('El especialista proveído no existe.')
      }

      return await this._specialistMentorsClinicalCaseService.getClosedPaginatedFindCases(
        page,
        size,
        specialist.document
      )
    }

    throw new UnprocessableContentError(
      'Solo los profesionales rurales y especialistas pueden acceder al histórico de sus casos clínicos.'
    )
  }
}
