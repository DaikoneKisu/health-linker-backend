import { isNotEmptyObject } from 'class-validator'
import { InternalServerError } from 'routing-controllers'
import {
  CreateRuralProfessionalDto,
  UpdateRuralProfessionalDto
} from '@/dtos/rural-professional.dto'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import {
  NewRuralProfessional,
  RuralProfessional,
  UpdateRuralProfessional
} from '@/types/rural-professional.type'
import { UserService } from './user.service'

export class RuralProfessionalService {
  private readonly _ruralProfessionalRepository: RuralProfessionalRepository
  private readonly _userService: UserService

  constructor(ruralProfessionalRepository: RuralProfessionalRepository, userService: UserService) {
    this._ruralProfessionalRepository = ruralProfessionalRepository
    this._userService = userService
  }

  public async getAllRuralProfessionals() {
    return await this._ruralProfessionalRepository.findAll()
  }

  public async getRuralProfessional(document: RuralProfessional['document']) {
    return await this._ruralProfessionalRepository.find(document)
  }

  public async getPaginatedRuralProfessionals(page: number = 1, size: number = 10) {
    return await this._ruralProfessionalRepository.findWithLimitAndOffset(size, page - 1)
  }

  public async createRuralProfessional(createRuralProfessionalDto: CreateRuralProfessionalDto) {
    const newUser = await this._userService.createUser({
      ...createRuralProfessionalDto,
      userType: 'rural professional'
    })

    if (!newUser) {
      //! This should be refactored, 'cuz it could shadow the actual error thrown from UserService.createUser
      throw new InternalServerError(
        'Error al crear el profesional rural, intente de nuevo más tarde.'
      )
    }

    const newRuralProfessional: NewRuralProfessional = {
      document: createRuralProfessionalDto.document,
      zone: createRuralProfessionalDto.zone
    }

    //TODO: Handle case when RuralProfessionalRespository.create returns undefined
    return await this._ruralProfessionalRepository.create(newRuralProfessional)
  }

  public async updateRuralProfessional(
    document: RuralProfessional['document'],
    updateRuralProfessionalDto: UpdateRuralProfessionalDto
  ) {
    const updateUser = await this._userService.updateUser(document, updateRuralProfessionalDto)

    if (!updateUser) {
      //! This should be refactored, 'cuz it could shadow the actual error thrown from UserService.updateUser
      throw new InternalServerError(
        'Error al actualizar el profesional rural, intente de nuevo más tarde.'
      )
    }

    const updateRuralProfessional: UpdateRuralProfessional = {}

    if (updateRuralProfessionalDto.zone) {
      updateRuralProfessional.zone = updateRuralProfessionalDto.zone
    }

    if (
      !isNotEmptyObject(updateRuralProfessional) &&
      updateUser === 'No se enviaron datos para actualizar.'
    ) {
      return 'No se enviaron datos para actualizar.'
    }

    //TODO: Refactor this to avoid multiple returns after here

    if (!isNotEmptyObject(updateRuralProfessional)) {
      return this._ruralProfessionalRepository.find(document)
    }

    //TODO: Handle case when RuralProfessionalRespository.update returns undefined
    return await this._ruralProfessionalRepository.update(document, updateRuralProfessional)
  }

  //! This method is not correctly implemented, if user is deleted, rural professional is also deleted, so it makes no sense to delete user before rural professional
  public async deleteRuralProfessional(document: RuralProfessional['document']) {
    const userDeleted = await this._userService.deleteUser(document)

    if (!userDeleted) {
      //! This should be refactored, 'cuz it could shadow the actual error thrown from UserService.deleteUser
      throw new InternalServerError(
        'Error al eliminar el profesional rural, intente de nuevo más tarde.'
      )
    }

    return await this._ruralProfessionalRepository.delete(document)
  }
}
