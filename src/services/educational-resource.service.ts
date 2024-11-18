import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'
import { Specialist } from '@/types/specialist.type'
import { EducationalResourceRepository } from '@/repositories/educational-resource.repository'
import { type EducationalResource } from '@/types/educational-resource.type'
import {
  CreateEducationalResourceDto,
  UpdateEducationalResourceDto
} from '@/dtos/educational-resource.dto'
import { Admin } from '@/types/admin.type'
import { SpecialistService } from './specialist.service'
import { AdminService } from './admin.service'

export class EducationalResourceService {
  private readonly _educationalResourceRepository: EducationalResourceRepository
  private readonly _specialistService: SpecialistService
  private readonly _adminService: AdminService

  constructor(
    educationalResourceRepository: EducationalResourceRepository,
    specialistService: SpecialistService,
    adminService: AdminService
  ) {
    this._educationalResourceRepository = educationalResourceRepository
    this._specialistService = specialistService
    this._adminService = adminService
  }

  public async getAllResources(query = '') {
    return await this._educationalResourceRepository.findAll(query)
  }

  public async getPaginatedResources(page: number = 1, size: number = 10, query = '') {
    return await this._educationalResourceRepository.findWithLimitAndOffset(size, page - 1, query)
  }

  public async getSingleResource(id: EducationalResource['id']) {
    return await this._educationalResourceRepository.findById(id)
  }

  public async createResource(
    createChatRoomDto: CreateEducationalResourceDto,
    authorEmail: Admin['email'] | null,
    authorDocument: Specialist['document'] | null
  ) {
    if (!authorEmail && !authorDocument) {
      throw new UnprocessableContentError('Debe especificar el creador del recurso')
    }
    if (authorEmail && authorDocument) {
      throw new UnprocessableContentError(
        'No se ha especificado al creador del recurso correctamente'
      )
    }

    if (authorEmail) {
      const admin = await this._adminService.getAdmin(authorEmail)
      if (!admin) {
        throw new UnprocessableContentError(
          'El usuario que quiere crear la sala no es un administrador'
        )
      }

      return await this._educationalResourceRepository.createAdmin({
        title: createChatRoomDto.title,
        content: createChatRoomDto.content,
        authorEmail
      })
    }

    if (authorDocument) {
      const specialist = await this._specialistService.getSpecialist(authorDocument)
      if (!specialist) {
        throw new UnprocessableContentError(
          'El usuario que quiere crear la sala no es un especialista.'
        )
      }

      return await this._educationalResourceRepository.createSpecialist({
        title: createChatRoomDto.title,
        content: createChatRoomDto.content,
        authorDocument
      })
    }

    return undefined
  }

  public async updateResource(
    id: EducationalResource['id'],
    updateResourceDto: UpdateEducationalResourceDto
  ) {
    return await this._educationalResourceRepository.updateResource(id, updateResourceDto)
  }

  public async deleteResource(id: EducationalResource['id']) {
    return await this._educationalResourceRepository.delete(id)
  }
}
