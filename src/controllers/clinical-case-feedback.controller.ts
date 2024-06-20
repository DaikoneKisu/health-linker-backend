import { Body, Delete, Get, JsonController, Param, Patch, Post } from 'routing-controllers'
import { ClinicalCaseFeedbackService } from '@/services/clinical-case-feedback.service'
import { ClinicalCaseFeedbackRepository } from '@/repositories/clinical-case-feedback.repository'
import {
  CreateClinicalCaseFeedbackDto,
  UpdateClinicalCaseFeedbackDto
} from '@/dtos/clinical-case-feedback.dto'

@JsonController('/clinical-cases-feedbacks')
export class ClinicalCaseFeedbackController {
  private readonly _clinicalCaseFeedbackService: ClinicalCaseFeedbackService =
    new ClinicalCaseFeedbackService(new ClinicalCaseFeedbackRepository())

  @Get()
  public getAll() {
    return this._clinicalCaseFeedbackService.getAll()
  }

  @Get('/by-clinical-case/:clinicalCaseId')
  public getByClinicalCase(@Param('clinicalCaseId') clinicalCaseId: number) {
    return this._clinicalCaseFeedbackService.getByClinicalCase(clinicalCaseId)
  }

  @Get('/by-user/:userDocument')
  public getByUser(@Param('userDocument') userDocument: string) {
    console.log(userDocument)
    return this._clinicalCaseFeedbackService.getByUser(userDocument)
  }

  @Get('/by-user-and-clinical-case/:userDocument/:clinicalCaseId')
  public getByUserAndClinicalCase(
    @Param('userDocument') userDocument: string,
    @Param('clinicalCaseId') clinicalCaseId: number
  ) {
    return this._clinicalCaseFeedbackService.getByUserAndClinicalCase(userDocument, clinicalCaseId)
  }

  @Post()
  public create(@Body() createClinicalCaseFeedbackDto: CreateClinicalCaseFeedbackDto) {
    return this._clinicalCaseFeedbackService.create(createClinicalCaseFeedbackDto)
  }

  @Patch('/:id/:clinicalCaseId/:userDocument')
  public update(
    @Param('id') id: number,
    @Param('clinicalCaseId') clinicalCaseId: number,
    @Param('userDocument') userDocument: string,
    @Body() updateClinicalCaseFeedbackDto: UpdateClinicalCaseFeedbackDto
  ) {
    return this._clinicalCaseFeedbackService.update(
      id,
      clinicalCaseId,
      userDocument,
      updateClinicalCaseFeedbackDto
    )
  }

  @Delete('/:id/:clinicalCaseId/:userDocument')
  public delete(
    @Param('id') id: number,
    @Param('clinicalCaseId') clinicalCaseId: number,
    @Param('userDocument') userDocument: string
  ) {
    return this._clinicalCaseFeedbackService.delete(id, clinicalCaseId, userDocument)
  }
}
