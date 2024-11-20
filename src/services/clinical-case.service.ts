import { isNotEmptyObject } from 'class-validator'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { RuralProfessionalService } from './rural-professional.service'
import { SpecialistService } from './specialist.service'
import { CreateClinicalCaseDto, UpdateClinicalCaseDto } from '@/dtos/clinical-case.dto'
import { ClinicalCase, NewClinicalCase, UpdateClinicalCase } from '@/types/clinical-case.type'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'
import { InternalServerError, NotFoundError, UnauthorizedError } from 'routing-controllers'
import { RuralProfessional } from '@/types/rural-professional.type'
import { FindUser } from '@/types/find-user.type'
import { Specialist } from '@/types/specialist.type'
import { FindAdmin } from '@/types/admin.type'
import { AdminService } from './admin.service'

export class ClinicalCaseService {
  private readonly _clinicalCaseRepository: ClinicalCaseRepository
  private readonly _ruralProfessionalService: RuralProfessionalService
  private readonly _specialtyRepository: SpecialtyRepository
  private readonly _specialistService: SpecialistService
  private readonly _adminService: AdminService

  constructor(
    clinicalCaseRepository: ClinicalCaseRepository,
    ruralProfessionalService: RuralProfessionalService,
    specialtyRepository: SpecialtyRepository,
    specialistService: SpecialistService,
    adminService: AdminService
  ) {
    this._clinicalCaseRepository = clinicalCaseRepository
    this._ruralProfessionalService = ruralProfessionalService
    this._specialtyRepository = specialtyRepository
    this._specialistService = specialistService
    this._adminService = adminService
  }

  public async getAllClinicalCases(query = '') {
    return await this._clinicalCaseRepository.findAll(query)
  }

  public async getClinicalCase(id: ClinicalCase['id']) {
    return await this._clinicalCaseRepository.find(id)
  }

  public async getOpenOrClosedRuralProfessionalClinicalCases(
    closed: ClinicalCase['isClosed'],
    ruralProfessionalDocument: RuralProfessional['document']
  ) {
    const ruralProfessional =
      await this._ruralProfessionalService.getRuralProfessional(ruralProfessionalDocument)

    if (!ruralProfessional) {
      throw new UnprocessableContentError('El usuario proveído no es un profesional rural.')
    }

    return await this._clinicalCaseRepository.findByIsClosedAndRuralProfessional(
      closed,
      ruralProfessional.document
    )
  }

  public async getPaginatedClinicalCases(page: number = 1, size: number = 10) {
    return await this._clinicalCaseRepository.findWithLimitAndOffset(size, page - 1)
  }

  public async getPaginatedOpenCases(page = 1, size = 100, query = '', email: FindAdmin['email']) {
    // Validate admin
    const admin = await this._adminService.getAdmin(email)
    if (!admin) {
      throw new UnauthorizedError('No tiene permisos para esta acción.')
    }

    return await this._clinicalCaseRepository.findOpenWithLimitAndOffset(page - 1, size, query)
  }

  public async getPaginatedClosedCases(
    page = 1,
    size = 100,
    query = '',
    email: FindAdmin['email']
  ) {
    // Validate admin
    const admin = await this._adminService.getAdmin(email)
    if (!admin) {
      throw new UnauthorizedError('No tiene permisos para esta acción.')
    }

    return await this._clinicalCaseRepository.findClosedWithLimitAndOffset(page - 1, size, query)
  }

  public async getPaginatedRecordClinicalCases(
    page: number = 1,
    size: number = 10,
    user: FindUser
  ) {
    if (user.userType === 'rural professional') {
      const ruralProfessional = await this._ruralProfessionalService.getRuralProfessional(
        user.document
      )

      if (!ruralProfessional) {
        throw new UnprocessableContentError('El profesional rural proveído no existe.')
      }

      return await this._clinicalCaseRepository.findByIsClosedAndRuralProfessionalWithLimitAndOffset(
        size,
        page - 1,
        true,
        ruralProfessional.document,
        ''
      )
    }

    if (user.userType === 'specialist') {
      throw new InternalServerError('El histórico de especialistas no está disponible todavía.')
    }

    throw new UnprocessableContentError(
      'Solo los profesionales rurales y especialistas pueden acceder al histórico de sus casos clínicos.'
    )
  }

  public async getPaginatedPublicClinicalCases(page = 1, size = 100, query = '') {
    return await this._clinicalCaseRepository.findByIsPublicWithLimitAndOffset(
      size,
      page - 1,
      true,
      query
    )
  }

  public async getPaginatedRuralProfessionalClinicalCases(
    page: number = 1,
    size: number = 10,
    ruralProfessionalDocument: RuralProfessional['document']
  ) {
    const ruralProfessional =
      await this._ruralProfessionalService.getRuralProfessional(ruralProfessionalDocument)

    if (!ruralProfessional) {
      throw new UnprocessableContentError('El usuario proveído no es un profesional rural.')
    }

    return await this._clinicalCaseRepository.findByRuralProfessionalWithLimitAndOffset(
      size,
      page - 1,
      ruralProfessional.document
    )
  }

  public async getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
    page: number = 1,
    size: number = 10,
    closed: ClinicalCase['isClosed'],
    ruralProfessionalDocument: RuralProfessional['document'],
    query = ''
  ) {
    const ruralProfessional =
      await this._ruralProfessionalService.getRuralProfessional(ruralProfessionalDocument)

    if (!ruralProfessional) {
      throw new UnprocessableContentError('El usuario proveído no es un profesional rural.')
    }

    return await this._clinicalCaseRepository.findByIsClosedAndRuralProfessionalWithLimitAndOffset(
      size,
      page - 1,
      closed,
      ruralProfessional.document,
      query
    )
  }

  public async getPaginatedRequiredSpecialistClinicalCases(
    page: number = 1,
    size: number = 10,
    specialistDocument: Specialist['document'],
    query = ''
  ) {
    const specialist = await this._specialistService.getSpecialist(specialistDocument)

    if (!specialist) {
      throw new UnprocessableContentError('El usuario proveído no es un especialista.')
    }

    return await this._clinicalCaseRepository.findByIsClosedAndRequiredSpecialtyWithLimitAndOffset(
      size,
      page - 1,
      false,
      specialist.specialtyId,
      query
    )
  }

  public async createClinicalCase(
    createClinicalCaseDto: CreateClinicalCaseDto,
    creatorDocument: RuralProfessional['document']
  ) {
    const ruralProfessional =
      await this._ruralProfessionalService.getRuralProfessional(creatorDocument)

    if (!ruralProfessional) {
      throw new UnprocessableContentError(
        'El usuario que quiere crear el caso clínico no es un profesional rural.'
      )
    }

    const requiredSpecialty = await this._specialtyRepository.find(
      createClinicalCaseDto.requiredSpecialtyId
    )

    if (!requiredSpecialty) {
      throw new UnprocessableContentError('La especialidad requerida proveída no existe.')
    }

    const newClinicalCase: NewClinicalCase = {
      description: createClinicalCaseDto.description,
      reason: createClinicalCaseDto.reason,
      patientBirthdate: new Date(createClinicalCaseDto.patientBirthdate),
      patientGender: createClinicalCaseDto.patientGender,
      patientReason: createClinicalCaseDto.patientReason,
      patientAssessment: createClinicalCaseDto.patientAssessment,
      requiredSpecialtyId: createClinicalCaseDto.requiredSpecialtyId,
      ruralProfessionalDocument: ruralProfessional.document
    }

    return await this._clinicalCaseRepository.create(newClinicalCase)
  }

  public async updateClinicalCase(
    id: ClinicalCase['id'],
    updateClinicalCaseDto: UpdateClinicalCaseDto,
    updaterDocument: RuralProfessional['document']
  ) {
    const updater = await this._ruralProfessionalService.getRuralProfessional(updaterDocument)

    if (!updater) {
      throw new UnprocessableContentError(
        'El usuario que quiere actualizar el caso clínico no es un profesional rural.'
      )
    }

    const clinicalCase = await this._clinicalCaseRepository.find(id)

    if (!clinicalCase) {
      throw new NotFoundError('El caso clínico que se quiere actualizar no existe.')
    }

    if (updater.document !== clinicalCase.ruralProfessionalDocument) {
      throw new UnprocessableContentError(
        'Solo el profesional rural que ingresó el caso clínico puede actualizarlo.'
      )
    }

    if (updateClinicalCaseDto.requiredSpecialtyId) {
      const requiredSpecialty = await this._specialtyRepository.find(
        updateClinicalCaseDto.requiredSpecialtyId
      )

      if (!requiredSpecialty) {
        throw new UnprocessableContentError('La especialidad requerida proveída no existe.')
      }
    }

    const updateClinicalCase: UpdateClinicalCase = {
      description: updateClinicalCaseDto.description,
      reason: updateClinicalCaseDto.reason,
      patientGender: updateClinicalCaseDto.patientGender,
      patientReason: updateClinicalCaseDto.patientReason,
      patientAssessment: updateClinicalCaseDto.patientAssessment,
      requiredSpecialtyId: updateClinicalCaseDto.requiredSpecialtyId
    }

    if (updateClinicalCaseDto.patientBirthdate) {
      updateClinicalCase.patientBirthdate = new Date(updateClinicalCaseDto.patientBirthdate)
    }

    const clinicalCaseKeys = [
      'description',
      'reason',
      'patientBirthdate',
      'patientGender',
      'patientReason',
      'patientAssessment',
      'requiredSpecialtyId',
      'ruralProfessionalDocument'
    ] as const

    for (const key of clinicalCaseKeys) {
      if (!(updateClinicalCase[key] == null)) {
        continue
      }

      delete updateClinicalCase[key]
    }

    if (!isNotEmptyObject(updateClinicalCase)) {
      return 'No se enviaron datos para actualizar.'
    }

    return await this._clinicalCaseRepository.update(id, updateClinicalCase)
  }

  public async reopenClinicalCase(
    id: ClinicalCase['id'],
    openerDocument: RuralProfessional['document']
  ) {
    const opener = await this._ruralProfessionalService.getRuralProfessional(openerDocument)

    if (!opener) {
      throw new UnprocessableContentError(
        'El usuario que quiere reabrir el caso clínico no es un profesional rural.'
      )
    }

    const clinicalCase = await this._clinicalCaseRepository.find(id)

    if (!clinicalCase) {
      throw new NotFoundError('El caso clínico que se quiere reabrir no existe.')
    }

    if (opener.document !== clinicalCase.ruralProfessionalDocument) {
      throw new UnprocessableContentError(
        'Solo el profesional rural que ingresó el caso clínico puede reabrirlo.'
      )
    }

    if (!clinicalCase.isClosed) {
      return 'El caso clínico ya se encuentra abierto.'
    }

    const openedClinicalCase = await this._clinicalCaseRepository.update(id, {
      isClosed: false,
      isPublic: false
    })

    if (!openedClinicalCase) {
      throw new InternalServerError(
        'Hubo un problema al intentar reabrir el caso clínico. Intente de nuevo más tarde.'
      )
    }

    return 'Caso clínico reabierto exitosamente.'
  }

  public async closeClinicalCase(
    id: ClinicalCase['id'],
    closerDocument: RuralProfessional['document']
  ) {
    const closer = await this._ruralProfessionalService.getRuralProfessional(closerDocument)

    if (!closer) {
      throw new UnprocessableContentError(
        'El usuario que quiere cerrar el caso clínico no es un profesional rural.'
      )
    }

    const clinicalCase = await this._clinicalCaseRepository.find(id)

    if (!clinicalCase) {
      throw new NotFoundError('El caso clínico que se quiere cerrar no existe.')
    }

    if (closer.document !== clinicalCase.ruralProfessionalDocument) {
      throw new UnprocessableContentError(
        'Solo el profesional rural que ingresó el caso clínico puede cerrarlo.'
      )
    }

    if (clinicalCase.isClosed) {
      return 'El caso clínico ya se encuentra cerrado.'
    }

    const closedClinicalCase = await this._clinicalCaseRepository.update(id, { isClosed: true })

    if (!closedClinicalCase) {
      throw new InternalServerError(
        'Hubo un problema al intentar cerrar el caso clínico. Intente de nuevo más tarde.'
      )
    }

    return 'Caso clínico cerrado exitosamente.'
  }

  public async publicizeClinicalCase(
    id: ClinicalCase['id'],
    publicizerDocument: RuralProfessional['document']
  ) {
    const publicizer = await this._ruralProfessionalService.getRuralProfessional(publicizerDocument)

    if (!publicizer) {
      throw new UnprocessableContentError(
        'El usuario que quiere hacer público el caso clínico no es un profesional rural.'
      )
    }

    const clinicalCase = await this._clinicalCaseRepository.find(id)

    if (!clinicalCase) {
      throw new NotFoundError('El caso clínico que se quiere hacer público no existe.')
    }

    if (publicizer.document !== clinicalCase.ruralProfessionalDocument) {
      throw new UnprocessableContentError(
        'Solo el profesional rural que ingresó el caso clínico puede hacerlo público.'
      )
    }

    if (!clinicalCase.isClosed) {
      throw new UnprocessableContentError(
        'El caso clínico debe estar cerrado para poder hacerse público.'
      )
    }

    if (clinicalCase.isPublic) {
      return 'El caso clínico ya es público.'
    }

    const publicClinicalCase = await this._clinicalCaseRepository.update(id, { isPublic: true })

    if (!publicClinicalCase) {
      throw new InternalServerError(
        'Hubo un problema al intentar hacer público el caso clínico. Intente de nuevo más tarde.'
      )
    }

    return 'Caso clínico hecho público exitosamente.'
  }

  public async deleteClinicalCase(id: ClinicalCase['id']) {
    const currentDate = new Date()
    return await this._clinicalCaseRepository.update(id, { errasedAt: currentDate })
  }
}
