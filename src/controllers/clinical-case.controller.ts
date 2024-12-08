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
  QueryParams,
  UnauthorizedError
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
import {
  CreateSpecialistMentor,
  CreateSpecialistMentorsClinicalCaseDto
} from '@/dtos/specialist-mentors-clinical-case.dto'
import { validateSync } from 'class-validator'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'

import { NotificationService } from '@/services/notification.service'

import { ClinicalCaseSearchDto } from '@/dtos/clinical-case-search.dto'
import { FindAdmin } from '@/types/admin.type'
import { AdminService } from '@/services/admin.service'

@JsonController('/clinical-cases')
export class ClinicalCaseController {
  private readonly _clinicalCaseService: ClinicalCaseService = new ClinicalCaseService(
    new ClinicalCaseRepository(),
    new RuralProfessionalService(
      new RuralProfessionalRepository(),
      new UserService(
        new UserRepository(),
        new EncryptService(),
        new AdminRepository(new EncryptService())
      )
    ),
    new SpecialtyRepository(),
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
  private readonly _notificationService: NotificationService = new NotificationService()
  private readonly _specialistMentorsClinicalCaseService: SpecialistMentorsClinicalCaseService =
    new SpecialistMentorsClinicalCaseService(
      new SpecialistMentorsClinicalCaseRepository(),
      this._clinicalCaseService,
      new SpecialistService(
        new SpecialistRepository(),
        new UserService(
          new UserRepository(),
          new EncryptService(),
          new AdminRepository(new EncryptService())
        ),
        new SpecialtyRepository()
      )
    )
  private readonly _clinicalCasesRecordService: ClinicalCasesRecordService =
    new ClinicalCasesRecordService(
      this._clinicalCaseService,
      this._specialistMentorsClinicalCaseService,
      new RuralProfessionalService(
        new RuralProfessionalRepository(),
        new UserService(
          new UserRepository(),
          new EncryptService(),
          new AdminRepository(new EncryptService())
        )
      ),
      new SpecialistService(
        new SpecialistRepository(),
        new UserService(
          new UserRepository(),
          new EncryptService(),
          new AdminRepository(new EncryptService())
        ),
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
    @QueryParams() { page, size, query }: ClinicalCaseSearchDto,
    @CurrentUser() user: FindUser
  ) {
    if (user.userType === 'rural professional') {
      return this._clinicalCaseService.getPaginatedOpenOrClosedRuralProfessionalClinicalCases(
        page,
        size,
        false,
        user.document,
        query
      )
    }

    if (user.userType === 'specialist') {
      return this._specialistMentorsClinicalCaseService.getOpenPaginatedFindCases(
        page,
        size,
        user.document,
        query
      )
    }

    throw new UnprocessableContentError(
      'Solo los profesionales rurales y especialistas pueden acceder a sus casos clínicos.'
    )
  }

  @HttpCode(200)
  @Get('/open/current-admin')
  public getOpenCurrentAdmin(
    @QueryParams() { page, size, query }: ClinicalCaseSearchDto,
    @CurrentUser() user: FindAdmin
  ) {
    return this._clinicalCaseService.getPaginatedOpenCases(page, size, query, user.email)
  }

  @HttpCode(200)
  @Get('/closed/current-admin')
  public getClosedCurrentAdmin(
    @QueryParams() { page, size, query }: ClinicalCaseSearchDto,
    @CurrentUser() user: FindAdmin
  ) {
    return this._clinicalCaseService.getPaginatedClosedCases(page, size, query, user.email)
  }

  @HttpCode(200)
  @Get('/not-mentored/current-admin')
  public getNotMentoredCurrentAdmin(
    @QueryParams() { page, size, query }: ClinicalCaseSearchDto,
    @CurrentUser() user: FindAdmin
  ) {
    return this._clinicalCaseService.getPaginatedNotMentoredCases(page, size, query, user.email)
  }

  @HttpCode(200)
  @Get('/mentored/current-admin')
  public getMentoredCurrentAdmin(
    @QueryParams() { page, size, query }: ClinicalCaseSearchDto,
    @CurrentUser() user: FindAdmin
  ) {
    return this._clinicalCaseService.getPaginatedMentoredCases(page, size, query, user.email)
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
    @QueryParams() { page, size, query }: ClinicalCaseSearchDto,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseService.getPaginatedRequiredSpecialistClinicalCases(
      page,
      size,
      document,
      query
    )
  }

  @HttpCode(200)
  @Get('/closed/current-user-record')
  public getPaginatedCurrentUserRecord(
    @QueryParams() { page, size, query }: ClinicalCaseSearchDto,
    @CurrentUser() user: FindUser
  ) {
    return this._clinicalCasesRecordService.getPaginatedRecord(page, size, user, query)
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
  @Get('/library')
  public getLibrary(@QueryParams() { page, size, query }: ClinicalCaseSearchDto) {
    return this._clinicalCaseService.getPaginatedPublicClinicalCases(page, size, query)
  }

  @HttpCode(200)
  @Get('/:id')
  @OnUndefined(404)
  public getOne(@Params() { id }: PositiveNumericIdDto) {
    return this._clinicalCaseService.getClinicalCase(id)
  }

  @HttpCode(201)
  @Post()
  public async create(
    @Body() createClinicalCaseDto: CreateClinicalCaseDto,
    @CurrentUser() { document, email }: FindUser
  ) {
    const clinicalCase = this._clinicalCaseService.createClinicalCase(
      createClinicalCaseDto,
      document
    )
    await this._notificationService.sendSms(
      email,
      'Your clinical case has been created successfully.'
    )
    return clinicalCase
  }

  @HttpCode(201)
  @Post('/mentor/:clinicalCaseId')
  public assignMentor(
    @Param('clinicalCaseId') clinicalCaseId: number,
    @CurrentUser() { email }: FindAdmin,
    @Body() createSpecialistMentorDto: CreateSpecialistMentor
  ) {
    if (!email) {
      throw new UnauthorizedError('Esta acción solo la puede hacer un administrador')
    }

    const createSpecialistMentorsClinicalCase = plainToClass(
      CreateSpecialistMentorsClinicalCaseDto,
      { clinicalCaseId, specialistDocument: createSpecialistMentorDto.specialistDocument }
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
    console.log('Endpoint update hit')
    console.log('ID:', id)
    console.log('Update DTO:', updateClinicalCaseDto)
    console.log('User Document:', document)
    return this._clinicalCaseService.updateClinicalCase(id, updateClinicalCaseDto, document)
  }

  @HttpCode(200)
  @Delete('/:id')
  public delete(@Params() { id }: PositiveNumericIdDto) {
    return this._clinicalCaseService.deleteClinicalCase(id)
  }
}
