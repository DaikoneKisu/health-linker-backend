import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post
} from 'routing-controllers'
import { ClinicalCaseFeedbackService } from '@/services/clinical-case-feedback.service'
import { ClinicalCaseFeedbackRepository } from '@/repositories/clinical-case-feedback.repository'
import {
  CreateClinicalCaseFeedbackDto,
  UpdateClinicalCaseFeedbackDto
} from '@/dtos/clinical-case-feedback.dto'
import { FindUser } from '@/types/find-user.type'
import { UserService } from '@/services/user.service'
import { UserRepository } from '@/repositories/user.repository'
import { EncryptService } from '@/services/encrypt.service'
import { AdminRepository } from '@/repositories/admin.repository'
import { ClinicalCaseService } from '@/services/clinical-case.service'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { SpecialistService } from '@/services/specialist.service'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { SpecialistMentorsClinicalCaseService } from '@/services/specialist-mentors-clinical-case.service'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'

@JsonController('/clinical-cases-feedbacks')
export class ClinicalCaseFeedbackController {
  private readonly _clinicalCaseFeedbackService: ClinicalCaseFeedbackService =
    new ClinicalCaseFeedbackService(
      new ClinicalCaseFeedbackRepository(),
      new UserService(
        new UserRepository(),
        new EncryptService(),
        new AdminRepository(new EncryptService())
      ),
      new ClinicalCaseService(
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
        )
      ),
      new SpecialistMentorsClinicalCaseService(
        new SpecialistMentorsClinicalCaseRepository(),
        new ClinicalCaseService(
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
    )

  @Get()
  public getAll() {
    return this._clinicalCaseFeedbackService.getAll()
  }

  @Get('/by-clinical-case/:clinicalCaseId')
  public getByClinicalCase(
    @Param('clinicalCaseId') clinicalCaseId: number,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseFeedbackService.getByClinicalCase(clinicalCaseId, document)
  }

  @Get('/by-user/:userDocument')
  public getByUser(@Param('userDocument') userDocument: string) {
    console.log(userDocument)
    return this._clinicalCaseFeedbackService.getByUser(userDocument)
  }

  @Get('/by-user-and-clinical-case/:userDocument/:clinicalCaseId')
  public getByUserAndClinicalCase(
    @Param('userDocument') userDocument: string,
    @Param('clinicalCaseId') clinicalCaseId: number,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseFeedbackService.getByUserAndClinicalCase(
      userDocument,
      clinicalCaseId,
      document
    )
  }

  @Post()
  public create(
    @Body() createClinicalCaseFeedbackDto: CreateClinicalCaseFeedbackDto,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseFeedbackService.create(createClinicalCaseFeedbackDto, document)
  }

  @Patch('/mine/:id/:clinicalCaseId')
  public updateMine(
    @Param('id') id: number,
    @Param('clinicalCaseId') clinicalCaseId: number,
    @Body() updateClinicalCaseFeedbackDto: UpdateClinicalCaseFeedbackDto,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseFeedbackService.update(
      id,
      clinicalCaseId,
      document,
      updateClinicalCaseFeedbackDto
    )
  }

  @Delete('/mine/:id/:clinicalCaseId')
  public deleteMine(
    @Param('id') id: number,
    @Param('clinicalCaseId') clinicalCaseId: number,
    @CurrentUser() { document }: FindUser
  ) {
    return this._clinicalCaseFeedbackService.delete(id, clinicalCaseId, document)
  }
}
