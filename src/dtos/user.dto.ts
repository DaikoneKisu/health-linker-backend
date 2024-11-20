import {
  IsBoolean,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator'
import { NewUser } from '@/types/new-user.type'
import { UpdateUser } from '@/types/update-user.type'

export class UserCredentialsDto {
  @IsString()
  @Matches(/^\d+$/, {
    message: 'El documento debe contener solo números.'
  })
  @Length(10, 10, {
    message: 'El documento debe tener exactamente 10 caracteres.'
  })
  public document: string

  @IsString()
  @Length(8, 60)
  public password: string

  constructor(document: string, password: string) {
    this.document = document
    this.password = password
  }
}

export class CreateUserDto implements Omit<NewUser, 'userType'> {
  @IsString()
  @Matches(/^\d+$/, {
    message: 'El documento debe contener solo números.'
  })
  @Length(10, 10, {
    message: 'El documento debe tener exactamente 10 caracteres.'
  })
  public document: string

  @IsString()
  @IsEmail()
  @Length(1, 254)
  public email: string

  @IsString()
  @Length(1, 100)
  public fullName: string

  @Length(10, 15)
  @IsNumberString()
  @IsString()
  public phoneNumber: string

  @IsString()
  @Length(8, 60)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos 1 letra minúscula, 1 letra mayúscula y 1 número.'
  })
  public password: string

  @IsBoolean()
  public isVerified: boolean

  constructor(
    document: string,
    email: string,
    fullName: string,
    phoneNumber: string,
    password: string,
    isVerified: boolean
  ) {
    this.document = document
    this.email = email
    this.fullName = fullName
    this.phoneNumber = phoneNumber
    this.password = password
    this.isVerified = isVerified
  }
}

export class UpdateUserDto implements Omit<UpdateUser, 'isVerified'> {
  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(1, 254)
  public email?: string

  @IsOptional()
  @IsString()
  @Length(1, 100)
  public fullName?: string

  @IsOptional()
  @IsString()
  @IsNumberString()
  @Length(10, 15)
  public phoneNumber?: string

  @IsOptional()
  @IsString()
  @Length(8, 60)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos 1 letra minúscula, 1 letra mayúscula y 1 número.'
  })
  public password?: string

  constructor(email?: string, fullName?: string, password?: string) {
    this.email = email
    this.fullName = fullName
    this.password = password
  }
}
