import { IsNumber, IsOptional, IsPositive, IsString, Length, Matches } from 'class-validator'
import { UpdateClinicalCaseFeedback } from '@/types/clinical-case-feedback.type'

export class CreateClinicalCaseFeedbackDto {
  @IsPositive()
  @IsNumber()
  public clinicalCaseId: number

  @Length(10, 10, {
    message: 'El documento debe tener exactamente 10 caracteres.'
  })
  @Matches(/^\d+$/, {
    message: 'El documento debe contener solo números.'
  })
  @IsString()
  public userDocument: string

  @Length(1, 500, {
    message:
      'El texto de la retroalimentación del caso clínico debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public text: string

  constructor(clinicalCaseId: number, userDocument: string, text: string) {
    this.clinicalCaseId = clinicalCaseId
    this.userDocument = userDocument
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
