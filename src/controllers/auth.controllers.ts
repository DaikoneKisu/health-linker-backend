import { Body, HttpCode, JsonController, Post } from 'routing-controllers'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { SpecialistService } from '@/services/specialist.service'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { UserCredentialsDto } from '@/dtos/user.dto'
import { CreateRuralProfessionalDto } from '@/dtos/rural-professional.dto'
import { CreateSpecialistDto } from '@/dtos/specialist.dto'

@JsonController('/auth')
export class AuthController {
  private readonly _authService: AuthService = new AuthService(
    new UserService(
      new UserRepository(),
      new EncryptService(),
      new AdminRepository(new EncryptService())
    ),
    new EncryptService(),
    new RuralProfessionalService(
      new RuralProfessionalRepository(),
      new UserService(
        new UserRepository(),
        new EncryptService(),
        new AdminRepository(new EncryptService())
      )
    ),
    new SpecialistService(
      new SpecialistRepository(),
      new UserService(
        new UserRepository(),
        new EncryptService(),
        new AdminRepository(new EncryptService())
      ),
      new SpecialtyRepository()
    )
  )

  @HttpCode(200)
  @Post('/signup/specialist')
  public specialistSignUp(@Body() createSpecialistDto: CreateSpecialistDto) {
    return this._authService.specialistSignUp({ ...createSpecialistDto, userType: 'specialist' })
  }

  @HttpCode(200)
  @Post('/signup/rural-professional')
  public ruralProfessionalSignUp(@Body() createRuralProfessionalDto: CreateRuralProfessionalDto) {
    return this._authService.ruralProfessionalSignUp({
      ...createRuralProfessionalDto,
      userType: 'rural professional'
    })
  }

  @HttpCode(200)
  @Post('/signin')
  public signIn(@Body() userCredentialsDto: UserCredentialsDto) {
    return this._authService.signIn(userCredentialsDto.document, userCredentialsDto.password)
  }
}
