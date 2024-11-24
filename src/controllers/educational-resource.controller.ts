import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Patch,
  Post,
  QueryParams
} from 'routing-controllers'
import { AdminRepository } from '@/repositories/admin.repository'
import { AdminService } from '@/services/admin.service'
import { EncryptService } from '@/services/encrypt.service'
import { type FindAdmin } from '@/types/admin.type'
import { UserRepository } from '@/repositories/user.repository'
import { EducationalResourceService } from '@/services/educational-resource.service'
import { EducationalResourceRepository } from '@/repositories/educational-resource.repository'
import { SpecialistService } from '@/services/specialist.service'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { UserService } from '@/services/user.service'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import {
  CreateEducationalResourceDto,
  EducationalResourceSearchQuery,
  UpdateEducationalResourceDto
} from '@/dtos/educational-resource.dto'
import { type EducationalResource } from '@/types/educational-resource.type'
import { type FindUser } from '@/types/find-user.type'
import { EducationalPaginationDto } from '@/dtos/educational-pagination.dto'

@JsonController('/educational-resources')
export class EducationalResourceController {
  private readonly _educationalResourceService = new EducationalResourceService(
    new EducationalResourceRepository(),
    new SpecialistService(
      new SpecialistRepository(),
      new UserService(
        new UserRepository(),
        new EncryptService(),
        new AdminRepository(new EncryptService())
      ),
      new SpecialtyRepository()
    ),
    new AdminService(
      new AdminRepository(new EncryptService()),
      new EncryptService(),
      new UserRepository()
    )
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: EducationalPaginationDto) {
    return this._educationalResourceService.getPaginatedResources(
      paginationQuery.page,
      paginationQuery.size,
      paginationQuery.query
    )
  }

  @HttpCode(200)
  @Get('/all')
  public getAll(@QueryParams() searchQuery: EducationalResourceSearchQuery) {
    return this._educationalResourceService.getAllResources(searchQuery.query)
  }

  @HttpCode(200)
  @Get('/:id')
  @OnUndefined(404)
  public getOne(@Param('id') id: EducationalResource['id']) {
    return this._educationalResourceService.getSingleResource(id)
  }

  @HttpCode(201)
  @Post()
  public create(
    @Body() createResourceDto: CreateEducationalResourceDto,
    @CurrentUser() user: FindUser | FindAdmin
  ) {
    if ('document' in user) {
      return this._educationalResourceService.createResource(createResourceDto, null, user.document)
    }
    return this._educationalResourceService.createResource(createResourceDto, user.email, null)
  }

  @HttpCode(200)
  @Patch('/:id')
  public update(
    @Body() updateResourceDto: UpdateEducationalResourceDto,
    @Param('id') id: EducationalResource['id']
  ) {
    return this._educationalResourceService.updateResource(id, updateResourceDto)
  }

  @HttpCode(200)
  @Delete('/:id')
  public delete(@Param('id') id: EducationalResource['id']) {
    return this._educationalResourceService.deleteResource(id)
  }
}
