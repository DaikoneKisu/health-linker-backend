import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Params,
  Patch,
  Post,
  QueryParams
} from 'routing-controllers'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { ClinicalCaseService } from '@/services/clinical-case.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { CreateClinicalCaseDto, UpdateClinicalCaseDto } from '@/dtos/clinical-case.dto'
import { FindUser } from '@/types/find-user.type'
import { PositiveNumericIdDto } from '@/dtos/common.dto'
import { SpecialistService } from '@/services/specialist.service'
import { SpecialistRepository } from '@/repositories/specialist.repository'

@JsonController('/clinical-cases')
export class ClinicalCaseController {
  private readonly _clinicalCaseService: ClinicalCaseService = new ClinicalCaseService(
    new ClinicalCaseRepository(),
    new RuralProfessionalService(
      new RuralProfessionalRepository(),
      new UserService(new UserRepository(), new EncryptService(), new AdminRepository())
    ),
    new SpecialtyRepository(),
    new SpecialistService(
      new SpecialistRepository(),
      new UserService(new UserRepository(), new EncryptService(), new AdminRepository()),
      new SpecialtyRepository()
    )
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._clinicalCaseService.getPaginatedClinicalCases(
      paginationQuery.page,
      paginationQuery.size
    )
  }

  @HttpCode(200)
  @Get('/current-rural-professional')
  public getCurrentRuralProfessional(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseService.getPaginatedRuralProfessionalClinicalCases(
      page,
      size,
      document
    )
  }

  @HttpCode(200)
  @Get('/open/current-rural-professional')
  public getOpenCurrentRuralProfessional(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseService.getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
      page,
      size,
      false,
      document
    )
  }

  @HttpCode(200)
  @Get('/closed/current-rural-professional')
  public getClosedCurrentRuralProfessional(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseService.getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
      page,
      size,
      true,
      document
    )
  }

  @HttpCode(200)
  @Get('/open/required-current-specialist')
  public async getRequiredCurrentSpecialist(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseService.getPaginatedRequiredSpecialistClinicalCases(
      page,
      size,
      document
    )
  }

  @HttpCode(200)
  @Get('/closed/current-user-record')
  public getCurrentUserRecord(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() user: FindUser
  ) {
    return this._clinicalCaseService.getPaginatedRecordClinicalCases(page, size, user)
  }

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._clinicalCaseService.getAllClinicalCases()
  }

  @HttpCode(200)
  @Get('/:id')
  @OnUndefined(404)
  public getOne(@Params() { id }: PositiveNumericIdDto) {
    return this._clinicalCaseService.getClinicalCase(id)
  }

  @HttpCode(201)
  @Post()
  public create(
    @Body() createClinicalCaseDto: CreateClinicalCaseDto,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseService.createClinicalCase(createClinicalCaseDto, document)
  }

  @HttpCode(200)
  @Patch('/close/:id')
  public close(@Params() { id }: PositiveNumericIdDto, @CurrentUser() user: FindUser) {
    return this._clinicalCaseService.closeClinicalCase(id, user.document)
  }

  @HttpCode(200)
  @Patch('/publicize/:id')
  public publicize(@Params() { id }: PositiveNumericIdDto, @CurrentUser() user: FindUser) {
    return this._clinicalCaseService.publicizeClinicalCase(id, user.document)
  }

  @HttpCode(200)
  @Patch('/reopen/:id')
  public reopen(@Params() { id }: PositiveNumericIdDto, @CurrentUser() user: FindUser) {
    return this._clinicalCaseService.reopenClinicalCase(id, user.document)
  }

  @HttpCode(200)
  @Patch('/:id')
  public update(
    @Body() updateClinicalCaseDto: UpdateClinicalCaseDto,
    @Params() { id }: PositiveNumericIdDto,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseService.updateClinicalCase(id, updateClinicalCaseDto, document)
  }

  @HttpCode(200)
  @Delete('/:id')
  public delete(@Params() { id }: PositiveNumericIdDto) {
    return this._clinicalCaseService.deleteClinicalCase(id)
  }
}
