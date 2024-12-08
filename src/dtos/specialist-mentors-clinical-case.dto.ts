import { NewSpecialistMentorsClinicalCase } from '@/types/specialist-mentors-clinical-case.type'
import { IsNumber, IsPositive, IsString, Length, Matches } from 'class-validator'

export class CreateSpecialistMentorsClinicalCaseDto implements NewSpecialistMentorsClinicalCase {
  @IsPositive()
  @IsNumber()
  clinicalCaseId: number

  @Length(10, 10, {
    message: 'El documento debe tener exactamente 10 caracteres.'
  })
  @Matches(/^\d+$/, {
    message: 'El documento debe contener solo números.'
  })
  @IsString()
  specialistDocument: string

  constructor(clinicalCaseId: number, specialistDocument: string) {
    this.clinicalCaseId = clinicalCaseId
    this.specialistDocument = specialistDocument
  }
}

export class CreateSpecialistMentor {
  @Length(10, 10, {
    message: 'El documento debe tener exactamente 10 caracteres.'
  })
  @Matches(/^\d+$/, {
    message: 'El documento debe contener solo números.'
  })
  @IsString()
  specialistDocument: string

  constructor(specialistDocument: string) {
    this.specialistDocument = specialistDocument
  }
}

export class PathSpecialistMentorsClinicalCaseDto {
  @IsPositive()
  @IsNumber()
  clinicalCaseId: number

  @Length(10, 10, {
    message: 'El documento del especialista debe tener exactamente 10 caracteres.'
  })
  @Matches(/^\d+$/, {
    message: 'El documento del especialista debe contener solo números.'
  })
  @IsString()
  specialistDocument: string

  constructor(clinicalCaseId: number, specialistDocument: string) {
    this.clinicalCaseId = clinicalCaseId
    this.specialistDocument = specialistDocument
  }
}
