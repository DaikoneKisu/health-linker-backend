import {
  IsEmail,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches
} from 'class-validator'
import { UserType, UserTypeArray } from '@/types/user-type.type'
import { NewUser } from '@/types/new-user.type'
import { UpdateUser } from '@/types/update-user.type'

export class UserCredentialsDto {
  @IsString()
  @IsNumberString()
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

export class CreateUserDto implements NewUser {
  @IsString()
  @IsNumberString()
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

  @IsString()
  @Length(8, 60)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos 1 letra minúscula, 1 letra mayúscula y 1 número.'
  })
  public password: string

  @IsString()
  @IsIn(UserTypeArray)
  public userType: UserType

  constructor(
    document: string,
    email: string,
    fullName: string,
    password: string,
    userType: UserType
  ) {
    this.document = document
    this.email = email
    this.fullName = fullName
    this.password = password
    this.userType = userType
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
  @Length(8, 60)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos 1 letra minúscula, 1 letra mayúscula y 1 número.'
  })
  public password?: string

  constructor(email: string, fullName: string, password: string) {
    this.email = email
    this.fullName = fullName
    this.password = password
  }
}
