import { NotFoundError, UnauthorizedError } from 'routing-controllers'
import { sign } from 'jsonwebtoken'
import { EncryptService } from '@services/encrypt.service'
import { UserService } from '@services/user.service'
import { RuralProfessionalService } from './rural-professional.service'
import { FindUser } from '@/types/find-user.type'
import { User } from '@/types/user.type'
import { UserType } from '@/types/user-type.type'
import { CreateUserDto } from '@/dtos/user.dto'
import { CreateRuralProfessionalDto } from '@/dtos/rural-professional.dto'
import { EXPIRES_IN, SECRET_KEY } from '@/config/env'

export class AuthService {
  private readonly _userService: UserService
  private readonly _encryptService: EncryptService
  private readonly _ruralProfessionalService: RuralProfessionalService

  constructor(
    userService: UserService,
    encryptService: EncryptService,
    ruralProfessionalSerivce: RuralProfessionalService
  ) {
    this._userService = userService
    this._encryptService = encryptService
    this._ruralProfessionalService = ruralProfessionalSerivce
  }

  public async specialistSignUp(
    createUserDto: CreateUserDto & { userType: UserType }
  ): Promise<string | undefined> {
    await this._userService.createUser(createUserDto)

    return 'Usuario registrado con éxito.'
  }

  public async ruralProfessionalSignUp(
    createRuralProfessionalDto: CreateRuralProfessionalDto & { userType: UserType }
  ): Promise<string | undefined> {
    await this._ruralProfessionalService.createRuralProfessional(createRuralProfessionalDto)

    return 'Usuario registrado con éxito.'
  }

  public async signIn(document: User['document'], password: string): Promise<string | undefined> {
    const user = await this._userService.getUser(document)

    if (!user) {
      //! This could be a security risk, as it could allow an attacker to enumerate users (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
      //TODO: Implement a way to handle consistently the error message for both existent and non-existent users
      throw new NotFoundError('El usuario con el documento provisto no está registrado.')
    }

    const isPasswordValid = await this._encryptService.comparePassword(
      password,
      (await this._userService.getPassword(document))!
    )

    if (!isPasswordValid) {
      //! This could be a security risk, as it could allow an attacker to enumerate users (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
      //TODO: Implement a way to handle consistently the error message for both existent and non-existent users
      throw new UnauthorizedError('La contraseña provista es incorrecta.')
    }

    return this.tokenize(user)
  }

  private tokenize(user: FindUser): string {
    console.log()

    return sign(user, SECRET_KEY, {
      expiresIn: EXPIRES_IN,
      notBefore: '0ms',
      algorithm: 'HS256'
    })
  }
}
