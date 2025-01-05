import { NewSpecialty, UpdateSpecialty } from '@/types/specialty.type'
import { IsOptional, IsString, Length, Matches } from 'class-validator'

export class CreateSpecialtyDto implements NewSpecialty {
  @IsString()
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'El nombre de la especialidad solo puede contener letras y espacios.'
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
  @Length(1, 256, {
    message: 'El nombre de la especialidad debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  public name?: string

  constructor(name?: string) {
    this.name = name
  }
}
