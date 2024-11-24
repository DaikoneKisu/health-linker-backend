import {
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Params,
  QueryParams
} from 'routing-controllers'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { PathSpecialistMentorsClinicalCaseDto } from '@/dtos/specialist-mentors-clinical-case.dto'
import { AdminRepository } from '@/repositories/admin.repository'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { UserRepository } from '@/repositories/user.repository'
import { ClinicalCaseService } from '@/services/clinical-case.service'
import { EncryptService } from '@/services/encrypt.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { SpecialistMentorsClinicalCaseService } from '@/services/specialist-mentors-clinical-case.service'
import { SpecialistService } from '@/services/specialist.service'
import { UserService } from '@/services/user.service'
import { Specialist } from '@/types/specialist.type'
import { AdminService } from '@/services/admin.service'

@JsonController('/specialist-mentors-clinical-cases')
export class SpecialistMentorsClinicalCaseController {
  private readonly _userService: UserService = new UserService(
    new UserRepository(),
    new EncryptService(),
    new AdminRepository(new EncryptService())
  )
  private readonly _specialistMentorsClinicalCaseService: SpecialistMentorsClinicalCaseService =
    new SpecialistMentorsClinicalCaseService(
      new SpecialistMentorsClinicalCaseRepository(),
      new ClinicalCaseService(
        new ClinicalCaseRepository(),
        new RuralProfessionalService(new RuralProfessionalRepository(), this._userService),
        new SpecialtyRepository(),
        new SpecialistService(
          new SpecialistRepository(),
          this._userService,
          new SpecialtyRepository()
        ),
        new AdminService(
          new AdminRepository(new EncryptService()),
          new EncryptService(),
          new UserRepository()
        )
      ),
      new SpecialistService(
        new SpecialistRepository(),
        this._userService,
        new SpecialtyRepository()
      )
    )

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._specialistMentorsClinicalCaseService.getAll()
  }

  @HttpCode(200)
  @Get('/mentors/:clinicalCaseId')
  public getMentors(@Param('clinicalCaseId') clinicalCaseId: number) {
    return this._specialistMentorsClinicalCaseService.getMentors(clinicalCaseId)
  }

  @HttpCode(200)
  @Get('/cases/:specialistDocument')
  public getPaginatedCases(
    @QueryParams() { page, size }: PaginationQuery,
    @Param('specialistDocument') specialistDocument: Specialist['document']
  ) {
    return this._specialistMentorsClinicalCaseService.getPaginatedCases(
      page,
      size,
      specialistDocument
    )
  }

  @HttpCode(200)
  @Get('/all/cases/:specialistDocument')
  public getAllCases(@Param('specialistDocument') specialistDocument: Specialist['document']) {
    return this._specialistMentorsClinicalCaseService.getCases(specialistDocument)
  }

  @HttpCode(200)
  @Get('/:clinicalCaseId/:specialistDocument')
  public get(
    @Params() { clinicalCaseId, specialistDocument }: PathSpecialistMentorsClinicalCaseDto
  ) {
    return this._specialistMentorsClinicalCaseService.get(clinicalCaseId, specialistDocument)
  }

  @HttpCode(200)
  @Delete('/:clinicalCaseId/:specialistDocument')
  public delete(
    @Params() { clinicalCaseId, specialistDocument }: PathSpecialistMentorsClinicalCaseDto
  ) {
    return this._specialistMentorsClinicalCaseService.delete(clinicalCaseId, specialistDocument)
  }
}
