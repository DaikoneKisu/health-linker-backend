import {
  IsISO8601,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Validate,
  IsNumber
} from 'class-validator'
import { Gender, GenderArray } from '@/types/gender.type'
import { DateBeforeNow } from '@/utils/date-before-now'

export class CreateClinicalCaseDto {
  @Length(1, 500, {
    message: 'La descripción debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public description: string

  @Length(1, 500, {
    message: 'El motivo debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public reason: string

  @Validate(DateBeforeNow, {
    message: 'La fecha de nacimiento del paciente no puede ser mayor a la fecha actual.'
  })
  @IsISO8601({ strict: true })
  public patientBirthdate: string

  @IsIn(GenderArray)
  @IsString()
  public patientGender: Gender

  @Length(1, 500, {
    message: 'El motivo del paciente debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public patientReason: string

  @Length(1, 500, {
    message: 'La valoración del paciente debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public patientAssessment: string

  @IsPositive()
  @IsNumber()
  public requiredSpecialtyId: number

  constructor(
    description: string,
    reason: string,
    patientBirthdate: string,
    patientGender: Gender,
    patientReason: string,
    patientAssessment: string,
    requiredSpecialtyId: number
  ) {
    this.description = description
    this.reason = reason
    this.patientBirthdate = patientBirthdate
    this.patientGender = patientGender
    this.patientReason = patientReason
    this.patientAssessment = patientAssessment
    this.requiredSpecialtyId = requiredSpecialtyId
  }
}

export class UpdateClinicalCaseDto {
  //@IsOptional()
  @IsNumber()
  public id?: number

  @IsOptional()
  @Length(1, 500, {
    message: 'La descripción debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public description: string

  @IsOptional()
  @Length(1, 500, {
    message: 'El motivo debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public reason: string

  @IsOptional()
  @Validate(DateBeforeNow, {
    message: 'La fecha de nacimiento del paciente no puede ser mayor a la fecha actual.'
  })
  @IsISO8601({ strict: true })
  public patientBirthdate: string

  @IsOptional()
  @IsIn(GenderArray)
  @IsString()
  public patientGender: Gender

  @IsOptional()
  @Length(1, 500, {
    message: 'El motivo del paciente debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public patientReason: string

  @IsOptional()
  @Length(1, 500, {
    message: 'La valoración del paciente debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public patientAssessment: string

  @IsOptional()
  @IsPositive()
  @IsNumber()
  public requiredSpecialtyId: number

  constructor(
    description: string,
    reason: string,
    patientBirthdate: string,
    patientGender: Gender,
    patientReason: string,
    patientAssessment: string,
    requiredSpecialtyId: number
  ) {
    this.description = description
    this.reason = reason
    this.patientBirthdate = patientBirthdate
    this.patientGender = patientGender
    this.patientReason = patientReason
    this.patientAssessment = patientAssessment
    this.requiredSpecialtyId = requiredSpecialtyId
  }
}
