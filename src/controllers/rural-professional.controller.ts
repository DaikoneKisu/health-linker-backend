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
import { AdminRepository } from '@/repositories/admin.repository'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { UserRepository } from '@/repositories/user.repository'
import { EncryptService } from '@/services/encrypt.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { UserService } from '@/services/user.service'
import { RuralProfessional } from '@/types/rural-professional.type'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { UpdateRuralProfessionalDto } from '@/dtos/rural-professional.dto'
import { AllUsersSearchQuery } from '@/dtos/all-users-search-query.dto'

@JsonController('/rural-professionals')
export class RuralProfessionalController {
  private readonly _ruralProfessionalService: RuralProfessionalService =
    new RuralProfessionalService(
      new RuralProfessionalRepository(),
      new UserService(
        new UserRepository(),
        new EncryptService(),
        new AdminRepository(new EncryptService())
      )
    )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._ruralProfessionalService.getPaginatedRuralProfessionals(
      paginationQuery.page,
      paginationQuery.size
    )
  }

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._ruralProfessionalService.getAllRuralProfessionals()
  }

  @HttpCode(200)
  @Get('/all/admin')
  public getAllAdmin(@QueryParams() searchQuery: AllUsersSearchQuery) {
    return this._ruralProfessionalService.getAllRuralsAdmin(searchQuery.query)
  }

  @HttpCode(200)
  @Get('/:document')
  @OnUndefined(404)
  public getOne(@Param('document') document: RuralProfessional['document']) {
    return this._ruralProfessionalService.getRuralProfessional(document)
  }

  @HttpCode(200)
  @Patch('/:document')
  public update(
    @Body() updateRuralProfessionalDto: UpdateRuralProfessionalDto,
    @Param('document') document: RuralProfessional['document']
  ) {
    return this._ruralProfessionalService.updateRuralProfessional(
      document,
      updateRuralProfessionalDto
    )
  }
}
