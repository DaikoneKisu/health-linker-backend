import { IsOptional, IsString, Length } from 'class-validator'
import { CreateUserDto, UpdateUserDto } from '@/dtos/user.dto'
import { NewRuralProfessional, UpdateRuralProfessional } from '@/types/rural-professional.type'
import { UpdateUser } from '@/types/update-user.type'

export class CreateRuralProfessionalDto extends CreateUserDto implements NewRuralProfessional {
  @IsString()
  @Length(1, 256, {
    message: 'La zona debe tener entre $constraint1 y $constraint2 caracteres'
  })
  public zone: string

  constructor(document: string, email: string, fullName: string, password: string, zone: string) {
    super(document, email, fullName, password)
    this.zone = zone
  }
}

export class UpdateRuralProfessionalDto
  extends UpdateUserDto
  implements Omit<UpdateUser, 'isVerified'>, UpdateRuralProfessional
{
  @IsOptional()
  @IsString()
  @Length(1, 256, {
    message: 'La zona debe tener entre $constraint1 y $constraint2 caracteres'
  })
  public zone?: string

  constructor(email?: string, fullName?: string, password?: string, zone?: string) {
    //TODO: add ? to params in UpdateUserDto constructor
    super(email, fullName, password)
    this.zone = zone
  }
}
