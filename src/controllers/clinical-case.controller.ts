import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
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
import { SpecialistMentorsClinicalCaseService } from '@/services/specialist-mentors-clinical-case.service'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import { ClinicalCasesRecordService } from '@/services/clinical-cases-record.service'
import { plainToClass } from 'class-transformer'
import { CreateSpecialistMentorsClinicalCaseDto } from '@/dtos/specialist-mentors-clinical-case.dto'
import { validateSync } from 'class-validator'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'

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
  private readonly _specialistMentorsClinicalCaseService: SpecialistMentorsClinicalCaseService =
    new SpecialistMentorsClinicalCaseService(
      new SpecialistMentorsClinicalCaseRepository(),
      this._clinicalCaseService,
      new SpecialistService(
        new SpecialistRepository(),
        new UserService(new UserRepository(), new EncryptService(), new AdminRepository()),
        new SpecialtyRepository()
      )
    )
  private readonly _clinicalCasesRecordService: ClinicalCasesRecordService =
    new ClinicalCasesRecordService(
      this._clinicalCaseService,
      this._specialistMentorsClinicalCaseService,
      new RuralProfessionalService(
        new RuralProfessionalRepository(),
        new UserService(new UserRepository(), new EncryptService(), new AdminRepository())
      ),
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

  // @HttpCode(200)
  // @Get('/current-rural-professional')
  // public getCurrentRuralProfessional(
  //   @QueryParams() { page, size }: PaginationQuery,
  //   @CurrentUser() { document }: FindUser
  // ) {
  //   return this._clinicalCaseService.getPaginatedRuralProfessionalClinicalCases(
  //     page,
  //     size,
  //     document
  //   )
  // }

  // @HttpCode(200)
  // @Get('/current-rural-specialist')
  // public getCurrentSpecialist(
  //   @QueryParams() { page, size }: PaginationQuery,
  //   @CurrentUser() { document }: FindUser
  // ) {
  //   return this._specialistMentorsClinicalCaseService.getPaginatedFindCases(page, size, document)
  // }

  @HttpCode(200)
  @Get('/current-user')
  public getCurrentUser(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() user: FindUser
  ) {
    if (user.userType === 'rural professional') {
      return this._clinicalCaseService.getPaginatedRuralProfessionalClinicalCases(
        page,
        size,
        user.document
      )
    }

    if (user.userType === 'specialist') {
      return this._specialistMentorsClinicalCaseService.getPaginatedFindCases(
        page,
        size,
        user.document
      )
    }

    throw new UnprocessableContentError(
      'Solo los profesionales rurales y especialistas pueden acceder a sus casos clínicos.'
    )
  }

  @HttpCode(200)
  @Get('/open/current-user')
  public getOpenCurrentUser(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() user: FindUser
  ) {
    if (user.userType === 'rural professional') {
      return this._clinicalCaseService.getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
        page,
        size,
        false,
        user.document
      )
    }

    if (user.userType === 'specialist') {
      return this._specialistMentorsClinicalCaseService.getOpenPaginatedFindCases(
        page,
        size,
        user.document
      )
    }

    throw new UnprocessableContentError(
      'Solo los profesionales rurales y especialistas pueden acceder a sus casos clínicos.'
    )
  }

  // @HttpCode(200)
  // @Get('/open/current-rural-professional')
  // public getOpenCurrentRuralProfessional(
  //   @QueryParams() { page, size }: PaginationQuery,
  //   @CurrentUser() { document }: FindUser
  // ) {
  //   return this._clinicalCaseService.getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
  //     page,
  //     size,
  //     false,
  //     document
  //   )
  // }

  // @HttpCode(200)
  // @Get('/closed/current-rural-professional')
  // public getClosedCurrentRuralProfessional(
  //   @QueryParams() { page, size }: PaginationQuery,
  //   @CurrentUser() { document }: FindUser
  // ) {
  //   return this._clinicalCaseService.getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
  //     page,
  //     size,
  //     true,
  //     document
  //   )
  // }

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
  public getPaginatedCurrentUserRecord(
    @QueryParams() { page, size }: PaginationQuery,
    @CurrentUser() user: FindUser
  ) {
    return this._clinicalCasesRecordService.getPaginatedRecord(page, size, user)
  }

  @HttpCode(200)
  @Get('/all/closed/current-user-record')
  public getCurrentUserRecord(@CurrentUser() user: FindUser) {
    return this._clinicalCasesRecordService.getRecord(user)
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

  @HttpCode(201)
  @Post('/mentor/:clinicalCaseId')
  public createCurrentUserAsMentorIfSpecialist(
    @Param('clinicalCaseId') clinicalCaseId: number,
    @CurrentUser() { document }: FindUser
  ) {
    const createSpecialistMentorsClinicalCase = plainToClass(
      CreateSpecialistMentorsClinicalCaseDto,
      { clinicalCaseId, specialistDocument: document }
    )

    //TODO: refactor this so the bad request error is more descriptive
    if (validateSync(createSpecialistMentorsClinicalCase).length > 0) {
      throw new BadRequestError('Los datos proveídos no son válidos.')
    }

    return this._specialistMentorsClinicalCaseService.create(createSpecialistMentorsClinicalCase)
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
