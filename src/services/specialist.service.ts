import { isNotEmptyObject } from 'class-validator'
import { InternalServerError } from 'routing-controllers'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { CreateSpecialistDto, UpdateSpecialistDto } from '@/dtos/specialist.dto'
import { NewSpecialist, Specialist, UpdateSpecialist } from '@/types/specialist.type'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'
import { UserService } from './user.service'

export class SpecialistService {
  private readonly _specialistRepository: SpecialistRepository
  private readonly _userService: UserService
  private readonly _specialtyRepository: SpecialtyRepository

  constructor(
    specialistRepository: SpecialistRepository,
    userService: UserService,
    specialtyRepository: SpecialtyRepository
  ) {
    this._specialistRepository = specialistRepository
    this._userService = userService
    this._specialtyRepository = specialtyRepository
  }

  public async getAllSpecialists() {
    return await this._specialistRepository.findAll()
  }

  public async getAllSpecialistsAdmin(query = '') {
    return await this._specialistRepository.findAllAdmin(query)
  }

  public async getAllSpecialistsBySpeciality(query = '', specialityId: number) {
    return await this._specialistRepository.findBySpeciality(query, specialityId)
  }

  public async getSpecialist(document: Specialist['document']) {
    return await this._specialistRepository.find(document)
  }

  public async getPaginatedSpecialists(page: number = 1, size: number = 10) {
    return await this._specialistRepository.findWithLimitAndOffset(size, page - 1)
  }

  public async createSpecialist(createSpecialistDto: CreateSpecialistDto) {
    const specialty = await this._specialtyRepository.find(createSpecialistDto.specialtyId)

    if (!specialty) {
      throw new UnprocessableContentError('La especialidad indicada no existe.')
    }

    const newUser = await this._userService.createUser({
      ...createSpecialistDto,
      userType: 'specialist'
    })

    if (!newUser) {
      //! This should be refactored, 'cuz it could shadow the actual error thrown from UserService.createUser
      throw new InternalServerError(
        'Error al crear el profesional rural, intente de nuevo más tarde.'
      )
    }

    const newSpecialist: NewSpecialist = {
      document: createSpecialistDto.document,
      specialtyId: createSpecialistDto.specialtyId
    }

    //TODO: Handle case when RuralProfessionalRespository.create returns undefined
    return await this._specialistRepository.create(newSpecialist)
  }

  public async updateSpecialist(
    document: Specialist['document'],
    updateSpecialistDto: UpdateSpecialistDto
  ) {
    if (updateSpecialistDto.specialtyId) {
      const specialty = await this._specialtyRepository.find(updateSpecialistDto.specialtyId)

      if (!specialty) {
        throw new UnprocessableContentError('La especialidad indicada no existe.')
      }
    }

    const updateUser = await this._userService.updateUser(document, updateSpecialistDto)

    if (!updateUser) {
      //! This should be refactored, 'cuz it could shadow the actual error thrown from UserService.updateUser
      throw new InternalServerError(
        'Error al actualizar el especialista, intente de nuevo más tarde.'
      )
    }

    const updateSpecialist: UpdateSpecialist = {}

    if (updateSpecialistDto.specialtyId) {
      updateSpecialist.specialtyId = updateSpecialistDto.specialtyId
    }

    if (
      !isNotEmptyObject(updateSpecialist) &&
      updateUser === 'No se enviaron datos para actualizar.'
    ) {
      return 'No se enviaron datos para actualizar.'
    }

    //TODO: Refactor this to avoid multiple returns after here

    if (!isNotEmptyObject(updateSpecialist)) {
      return this._specialistRepository.find(document)
    }

    //TODO: Handle case when SpecialistRespository.update returns undefined
    return await this._specialistRepository.update(document, updateSpecialist)
  }
}
