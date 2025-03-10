import {
  Body,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Patch,
  QueryParams
} from 'routing-controllers'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { UpdateSpecialistDto } from '@/dtos/specialist.dto'
import { AdminRepository } from '@/repositories/admin.repository'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { UserRepository } from '@/repositories/user.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { EncryptService } from '@/services/encrypt.service'
import { SpecialistService } from '@/services/specialist.service'
import { UserService } from '@/services/user.service'
import { Specialist } from '@/types/specialist.type'
import { AllUsersSearchQuery } from '@/dtos/all-users-search-query.dto'
import { Specialty } from '@/types/specialty.type'

@JsonController('/specialists')
export class SpecialistController {
  private readonly _specialistService: SpecialistService = new SpecialistService(
    new SpecialistRepository(),
    new UserService(
      new UserRepository(),
      new EncryptService(),
      new AdminRepository(new EncryptService())
    ),
    new SpecialtyRepository()
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._specialistService.getPaginatedSpecialists(
      paginationQuery.page,
      paginationQuery.size
    )
  }

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._specialistService.getAllSpecialists()
  }

  @HttpCode(200)
  @Get('/all/admin')
  public getAllAdmin(@QueryParams() searchQuery: AllUsersSearchQuery) {
    return this._specialistService.getAllSpecialistsAdmin(searchQuery.query)
  }

  @HttpCode(200)
  @Get('/all/speciality/:specialityId')
  public getBySpeciality(
    @QueryParams() searchQuery: AllUsersSearchQuery,
    @Param('specialityId') specialityId: Specialty['id']
  ) {
    return this._specialistService.getAllSpecialistsBySpeciality(searchQuery.query, specialityId)
  }

  @HttpCode(200)
  @Get('/:document')
  @OnUndefined(404)
  public getOne(@Param('document') document: Specialist['document']) {
    return this._specialistService.getSpecialist(document)
  }

  @HttpCode(200)
  @Patch('/:document')
  public update(
    @Body() updateSpecialistDto: UpdateSpecialistDto,
    @Param('document') document: Specialist['document']
  ) {
    return this._specialistService.updateSpecialist(document, updateSpecialistDto)
  }
}
