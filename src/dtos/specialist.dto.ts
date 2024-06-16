import { IsNumber, IsOptional, IsPositive } from 'class-validator'
import { NewSpecialist, UpdateSpecialist } from '@/types/specialist.type'
import { CreateUserDto, UpdateUserDto } from '@/dtos/user.dto'

export class CreateSpecialistDto extends CreateUserDto implements NewSpecialist {
  @IsNumber()
  @IsPositive()
  public specialtyId: number

  constructor(
    document: string,
    email: string,
    fullName: string,
    password: string,
    specialtyId: number
  ) {
    super(document, email, fullName, password)
    this.specialtyId = specialtyId
  }
}

export class UpdateSpecialistDto extends UpdateUserDto implements UpdateSpecialist {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public specialtyId?: number

  constructor(email?: string, fullName?: string, password?: string, specialtyId?: number) {
    super(email, fullName, password)
    this.specialtyId = specialtyId
  }
}
