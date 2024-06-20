import { IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator'
import { UpdateClinicalCaseFeedback } from '@/types/clinical-case-feedback.type'

export class CreateClinicalCaseFeedbackDto {
  @IsPositive()
  @IsNumber()
  public clinicalCaseId: number

  @Length(1, 500, {
    message:
      'El texto de la retroalimentación del caso clínico debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public text: string

  constructor(clinicalCaseId: number, text: string) {
    this.clinicalCaseId = clinicalCaseId
    this.text = text
  }
}

export class UpdateClinicalCaseFeedbackDto implements UpdateClinicalCaseFeedback {
  @Length(1, 500, {
    message:
      'El texto de la retroalimentación del caso clínico debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  @IsOptional()
  public text: string

  constructor(text: string) {
    this.text = text
  }
}
