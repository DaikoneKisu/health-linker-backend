import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator'
import { NewAdmin, UpdateAdmin } from '@/types/admin.type'

export class AdminCredentialsDto {
  @IsString()
  @IsEmail()
  @Length(1, 254)
  public email: string

  @IsString()
  @Length(8, 60)
  public password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}

export class CreateAdminDto implements NewAdmin {
  @IsString()
  @IsEmail()
  @Length(1, 254)
  public email: string

  @IsString()
  @Length(1, 100)
  public fullName: string

  @IsString()
  @Length(8, 60)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos 1 letra minúscula, 1 letra mayúscula y 1 número.'
  })
  public password: string

  constructor(email: string, fullName: string, password: string) {
    this.email = email
    this.fullName = fullName
    this.password = password
  }
}

export class UpdateAdminDto implements UpdateAdmin {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  public fullName?: string

  @IsOptional()
  @IsString()
  @Length(8, 60)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos 1 letra minúscula, 1 letra mayúscula y 1 número.'
  })
  public password?: string

  constructor(fullName?: string, password?: string) {
    this.fullName = fullName
    this.password = password
  }
}
