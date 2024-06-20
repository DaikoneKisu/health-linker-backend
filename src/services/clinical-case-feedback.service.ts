import {
  CreateClinicalCaseFeedbackDto,
  UpdateClinicalCaseFeedbackDto
} from '@/dtos/clinical-case-feedback.dto'
import { ClinicalCaseFeedbackRepository } from '@/repositories/clinical-case-feedback.repository'
import {
  NewClinicalCaseFeedback,
  UpdateClinicalCaseFeedback
} from '@/types/clinical-case-feedback.type'
import { isNotEmptyObject } from 'class-validator'
import { UserService } from './user.service'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'
import { ClinicalCaseService } from './clinical-case.service'
import { SpecialistMentorsClinicalCaseService } from './specialist-mentors-clinical-case.service'
import { ForbiddenError, NotFoundError } from 'routing-controllers'

export class ClinicalCaseFeedbackService {
  private readonly _clinicalCaseFeedbackRepository: ClinicalCaseFeedbackRepository
  private readonly _userService: UserService
  private readonly _clinicalCaseService: ClinicalCaseService
  private readonly _specialistMentorsClinicalCaseService: SpecialistMentorsClinicalCaseService

  constructor(
    clinicalCaseFeedbackRepository: ClinicalCaseFeedbackRepository,
    userService: UserService,
    clinicalCaseService: ClinicalCaseService,
    specialistMentorsClinicalCaseService: SpecialistMentorsClinicalCaseService
  ) {
    this._clinicalCaseFeedbackRepository = clinicalCaseFeedbackRepository
    this._userService = userService
    this._clinicalCaseService = clinicalCaseService
    this._specialistMentorsClinicalCaseService = specialistMentorsClinicalCaseService
  }

  public async getAll() {
    return await this._clinicalCaseFeedbackRepository.findAll()
  }

  public async getByClinicalCase(clinicalCaseId: number, requesterDocument: string) {
    const user = await this._userService.getUser(requesterDocument)

    if (!user) {
      throw new UnprocessableContentError(
        'El usuario que está pidiendo acceso a las retroalimentaciones no existe.'
      )
    }

    const clinicalCase = await this._clinicalCaseService.getClinicalCase(clinicalCaseId)

    if (!clinicalCase) {
      throw new UnprocessableContentError('El caso clínico proveído no existe.')
    }

    if (user.userType === 'rural professional') {
      if (clinicalCase.ruralProfessionalDocument !== requesterDocument) {
        throw new NotFoundError('Las retroalimentaciones requeridas no existen.')
      }
    } else if (user.userType === 'specialist') {
      const mentors = await this._specialistMentorsClinicalCaseService.get(
        clinicalCase.id,
        requesterDocument
      )

      if (!mentors) {
        throw new ForbiddenError(
          'El especialista que está pidiendo acceso a las retroalimentaciones no está en el caso clínico.'
        )
      }
    } else {
      throw new UnprocessableContentError(
        'Solo los profesionales rurales y especialistas pueden acceder a las retroalimentaciones de casos clínicos.'
      )
    }

    return await this._clinicalCaseFeedbackRepository.findByClinicalCase(clinicalCaseId)
  }

  public async getByUser(userDocument: string) {
    return await this._clinicalCaseFeedbackRepository.findByUser(userDocument)
  }

  public async getByUserAndClinicalCase(
    userDocument: string,
    clinicalCaseId: number,
    requesterDocument: string
  ) {
    const user = await this._userService.getUser(requesterDocument)

    if (!user) {
      throw new UnprocessableContentError(
        'El usuario que está pidiendo acceso a las retroalimentaciones no existe.'
      )
    }

    const clinicalCase = await this._clinicalCaseService.getClinicalCase(clinicalCaseId)

    if (!clinicalCase) {
      throw new UnprocessableContentError('El caso clínico proveído no existe.')
    }

    if (user.userType === 'rural professional') {
      if (clinicalCase.ruralProfessionalDocument !== requesterDocument) {
        throw new NotFoundError('Las retroalimentaciones requeridas no existen.')
      }
    } else if (user.userType === 'specialist') {
      const mentors = await this._specialistMentorsClinicalCaseService.get(
        clinicalCase.id,
        requesterDocument
      )

      if (!mentors) {
        throw new ForbiddenError(
          'El especialista que está pidiendo acceso a las retroalimentaciones no está en el caso clínico.'
        )
      }
    } else {
      throw new UnprocessableContentError(
        'Solo los profesionales rurales y especialistas pueden acceder a las retroalimentaciones de casos clínicos.'
      )
    }

    return await this._clinicalCaseFeedbackRepository.findByUserAndClinicalCase(
      userDocument,
      clinicalCaseId
    )
  }

  public async create(
    createClinicalCaseFeedbackDto: CreateClinicalCaseFeedbackDto,
    creatorDocument: string
  ) {
    const user = await this._userService.getUser(creatorDocument)

    if (!user) {
      throw new UnprocessableContentError('El usuario proveído no existe.')
    }

    const clinicalCase = await this._clinicalCaseService.getClinicalCase(
      createClinicalCaseFeedbackDto.clinicalCaseId
    )

    if (!clinicalCase) {
      throw new UnprocessableContentError('El caso clínico proveído no existe.')
    }

    if (user.userType === 'rural professional') {
      if (clinicalCase.ruralProfessionalDocument !== creatorDocument) {
        throw new UnprocessableContentError(
          'El profesional rural proveído no está en el caso clínico.'
        )
      }
    } else if (user.userType === 'specialist') {
      const mentors = await this._specialistMentorsClinicalCaseService.get(
        clinicalCase.id,
        creatorDocument
      )

      if (!mentors) {
        throw new UnprocessableContentError('El especialista proveído no está en el caso clínico.')
      }
    } else {
      throw new UnprocessableContentError(
        'Solo los profesionales rurales y especialistas pueden retroalimentar casos clínicos.'
      )
    }

    if (clinicalCase.isClosed) {
      throw new UnprocessableContentError(
        'No se puede retroalimentar casos clínicos que están cerrados.'
      )
    }

    const feedbacks = await this._clinicalCaseFeedbackRepository.findByClinicalCase(
      createClinicalCaseFeedbackDto.clinicalCaseId
    )

    const lastFeedbackId = feedbacks.at(-1)?.id || 0

    const newClinicalCaseFeedback: NewClinicalCaseFeedback = {
      id: lastFeedbackId + 1,
      clinicalCaseId: createClinicalCaseFeedbackDto.clinicalCaseId,
      userDocument: creatorDocument,
      text: createClinicalCaseFeedbackDto.text
    }

    return await this._clinicalCaseFeedbackRepository.create(newClinicalCaseFeedback)
  }

  public async update(
    id: number,
    clinicalCaseId: number,
    updaterDocument: string,
    updateClinicalCaseFeedbackDto: UpdateClinicalCaseFeedbackDto
  ) {
    const user = await this._userService.getUser(updaterDocument)

    if (!user) {
      throw new UnprocessableContentError('El usuario proveído no existe.')
    }

    const clinicalCase = await this._clinicalCaseService.getClinicalCase(clinicalCaseId)

    if (!clinicalCase) {
      throw new UnprocessableContentError('El caso clínico proveído no existe.')
    }

    if (user.userType === 'rural professional') {
      if (clinicalCase.ruralProfessionalDocument !== updaterDocument) {
        throw new UnprocessableContentError(
          'El profesional rural proveído no está en el caso clínico.'
        )
      }
    } else if (user.userType === 'specialist') {
      const mentors = await this._specialistMentorsClinicalCaseService.get(
        clinicalCase.id,
        updaterDocument
      )

      if (!mentors) {
        throw new UnprocessableContentError('El especialista proveído no está en el caso clínico.')
      }
    } else {
      throw new UnprocessableContentError(
        'Solo los profesionales rurales y especialistas pueden retroalimentar casos clínicos.'
      )
    }

    if (clinicalCase.isClosed) {
      throw new UnprocessableContentError(
        'No se pueden actualizar retroalimentaciones de casos clínicos que están cerrados.'
      )
    }

    const feedback = await this._clinicalCaseFeedbackRepository.find(
      id,
      clinicalCaseId,
      updaterDocument
    )

    if (!feedback) {
      throw new NotFoundError('La retroalimentación que se quiere actualizar no existe.')
    }

    const updateClinicalCaseFeedback: UpdateClinicalCaseFeedback = {}

    if (!(updateClinicalCaseFeedbackDto.text == null)) {
      updateClinicalCaseFeedback.text = updateClinicalCaseFeedbackDto.text
    }

    if (!isNotEmptyObject(updateClinicalCaseFeedback)) {
      return 'No se enviaron datos para actualizar.'
    }

    return await this._clinicalCaseFeedbackRepository.update(
      id,
      clinicalCaseId,
      updaterDocument,
      updateClinicalCaseFeedback
    )
  }

  public async delete(id: number, clinicalCaseId: number, deleterDocument: string) {
    const user = await this._userService.getUser(deleterDocument)

    if (!user) {
      throw new UnprocessableContentError('El usuario proveído no existe.')
    }

    const clinicalCase = await this._clinicalCaseService.getClinicalCase(clinicalCaseId)

    if (!clinicalCase) {
      throw new UnprocessableContentError('El caso clínico proveído no existe.')
    }

    if (user.userType === 'rural professional') {
      if (clinicalCase.ruralProfessionalDocument !== deleterDocument) {
        throw new UnprocessableContentError(
          'El profesional rural proveído no está en el caso clínico.'
        )
      }
    } else if (user.userType === 'specialist') {
      const mentors = await this._specialistMentorsClinicalCaseService.get(
        clinicalCase.id,
        deleterDocument
      )

      if (!mentors) {
        throw new UnprocessableContentError('El especialista proveído no está en el caso clínico.')
      }
    } else {
      throw new UnprocessableContentError(
        'Solo los profesionales rurales y especialistas pueden retroalimentar casos clínicos.'
      )
    }

    if (clinicalCase.isClosed) {
      throw new UnprocessableContentError(
        'No se pueden eliminar retroalimentaciones de casos clínicos que están cerrados.'
      )
    }

    const feedback = await this._clinicalCaseFeedbackRepository.find(
      id,
      clinicalCaseId,
      deleterDocument
    )

    if (!feedback) {
      throw new NotFoundError('La retroalimentación que se quiere eliminar no existe.')
    }

    return this._clinicalCaseFeedbackRepository.delete(id, clinicalCaseId, deleterDocument)
  }
}
