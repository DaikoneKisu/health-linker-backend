import { IsString, Matches, NotEquals } from 'class-validator'

export class CreateClinicalCaseFileDto {
  @NotEquals('0', {
    message: 'El id de caso clínico no puede ser 0.'
  })
  @Matches(/^\d+$/, {
    message: 'El id de caso clínico debe ser un número.'
  })
  @IsString()
  clinicalCaseId: string

  constructor(clinicalCaseId: string) {
    this.clinicalCaseId = clinicalCaseId
  }
}
