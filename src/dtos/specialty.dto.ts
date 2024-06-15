import { NewSpecialty, UpdateSpecialty } from '@/types/specialty.type'
import { IsLowercase, IsOptional, IsString, Length, Matches } from 'class-validator'

export class CreateSpecialtyDto implements NewSpecialty {
  @IsString()
  @Matches(/^[a-z ]+$/, {
    message: 'El nombre de la especialidad solo puede contener letras minúsculas y espacios.'
  })
  @Length(1, 256, {
    message: 'El nombre de la especialidad debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  public name: string

  constructor(name: string) {
    this.name = name
  }
}

export class UpdateSpecialtyDto implements UpdateSpecialty {
  @IsOptional()
  @IsString()
  @IsLowercase({
    message: 'El nombre de la especialidad debe estar en minúsculas.'
  })
  @Length(1, 256, {
    message: 'El nombre de la especialidad debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  public name?: string

  constructor(name?: string) {
    this.name = name
  }
}
