import { NotFoundError, UnauthorizedError } from 'routing-controllers'
import { sign, verify } from 'jsonwebtoken'
import { EncryptService } from '@services/encrypt.service'
import { UserService } from '@services/user.service'
import { RuralProfessionalService } from './rural-professional.service'
import { FindUser } from '@/types/find-user.type'
import { User } from '@/types/user.type'
import { UserType } from '@/types/user-type.type'
import { CreateRuralProfessionalDto } from '@/dtos/rural-professional.dto'
import { EXPIRES_IN, SECRET_KEY } from '@/config/env'
import { SpecialistService } from './specialist.service'
import { CreateSpecialistDto } from '@/dtos/specialist.dto'

export class AuthService {
  private readonly _userService: UserService
  private readonly _encryptService: EncryptService
  private readonly _ruralProfessionalService: RuralProfessionalService
  private readonly _specialistService: SpecialistService

  constructor(
    userService: UserService,
    encryptService: EncryptService,
    ruralProfessionalSerivce: RuralProfessionalService,
    specialistService: SpecialistService
  ) {
    this._userService = userService
    this._encryptService = encryptService
    this._ruralProfessionalService = ruralProfessionalSerivce
    this._specialistService = specialistService
  }

  public async specialistSignUp(
    createSpecialistDto: CreateSpecialistDto & { userType: UserType }
  ): Promise<string | undefined> {
    await this._specialistService.createSpecialist(createSpecialistDto)

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
    return sign(user, SECRET_KEY, {
      expiresIn: EXPIRES_IN,
      notBefore: '0ms',
      algorithm: 'HS256'
    })
  }

  public verify(token?: string): FindUser | undefined {
    if (token == null) {
      return
    }

    const extractedToken = token?.startsWith('Bearer ') ? token.split(' ')[1] : token

    if (extractedToken == null) {
      return
    }

    try {
      return verify(extractedToken, SECRET_KEY, { algorithms: ['HS256'] }) as FindUser
    } catch (_e: unknown) {
      return
    }
  }
}
