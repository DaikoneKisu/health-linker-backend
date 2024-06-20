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

export class ClinicalCaseFeedbackService {
  private readonly _clinicalCaseFeedbackRepository: ClinicalCaseFeedbackRepository

  constructor(clinicalCaseFeedbackRepository: ClinicalCaseFeedbackRepository) {
    this._clinicalCaseFeedbackRepository = clinicalCaseFeedbackRepository
  }

  public async getAll() {
    return await this._clinicalCaseFeedbackRepository.findAll()
  }

  //TODO: for all getBy, check if the by clause exists (if clinical case exists, if user exists, etc)

  public async getByClinicalCase(clinicalCaseId: number) {
    return await this._clinicalCaseFeedbackRepository.findByClinicalCase(clinicalCaseId)
  }

  public async getByUser(userDocument: string) {
    return await this._clinicalCaseFeedbackRepository.findByUser(userDocument)
  }

  public async getByUserAndClinicalCase(userDocument: string, clinicalCaseId: number) {
    return await this._clinicalCaseFeedbackRepository.findByUserAndClinicalCase(
      userDocument,
      clinicalCaseId
    )
  }

  public async create(createClinicalCaseFeedbackDto: CreateClinicalCaseFeedbackDto) {
    //TODO: validate if user exists
    //TODO: validate if clinical case exists
    //TODO: validate if user is in clinical case
    //* Specialists are in a clinical case if they are mentoring it (SpecialistMentorsClinicalCase.specialistDocument)
    //* Rural professionals are in a clinical case if they created it (ClinicalCase.ruralProfessionalDocument)
    const feedbacks = await this._clinicalCaseFeedbackRepository.findByClinicalCase(
      createClinicalCaseFeedbackDto.clinicalCaseId
    )

    const lastFeedbackId = feedbacks.at(-1)?.id || 0

    const newClinicalCaseFeedback: NewClinicalCaseFeedback = {
      id: lastFeedbackId + 1,
      clinicalCaseId: createClinicalCaseFeedbackDto.clinicalCaseId,
      userDocument: createClinicalCaseFeedbackDto.userDocument,
      text: createClinicalCaseFeedbackDto.text
    }

    return await this._clinicalCaseFeedbackRepository.create(newClinicalCaseFeedback)
  }

  public async update(
    id: number,
    clinicalCaseId: number,
    userDocument: string,
    updateClinicalCaseFeedbackDto: UpdateClinicalCaseFeedbackDto
  ) {
    //TODO: validate if user who wants to update exists
    //TODO: validate if clinical case exists
    //TODO: validate if user who wants to update is in clinical case
    //* Specialists are in a clinical case if they are mentoring it (SpecialistMentorsClinicalCase.specialistDocument)
    //* Rural professionals are in a clinical case if they created it (ClinicalCase.ruralProfessionalDocument)
    //TODO: validate if user who wants to update is the owner of the feedback
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
      userDocument,
      updateClinicalCaseFeedback
    )
  }

  public async delete(id: number, clinicalCaseId: number, userDocument: string) {
    //TODO: validate if the user who wants to delete the feedback exists
    //TODO: validate if the user who wants to delete the feedback is in the clinical case
    //TODO: validate if the user who wants to delete the feedback is who made it
    //TODO: validate if this feedback exists
    return this._clinicalCaseFeedbackRepository.delete(id, clinicalCaseId, userDocument)
  }
}
