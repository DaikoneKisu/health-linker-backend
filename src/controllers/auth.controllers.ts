import { Body, HttpCode, JsonController, Post } from 'routing-controllers'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { UserCredentialsDto } from '@/dtos/user.dto'
import { CreateRuralProfessionalDto } from '@/dtos/rural-professional.dto'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'

@JsonController('/auth')
export class AuthController {
  private readonly _authService: AuthService = new AuthService(
    new UserService(new UserRepository(), new EncryptService(), new AdminRepository()),
    new EncryptService(),
    new RuralProfessionalService(
      new RuralProfessionalRepository(),
      new UserService(new UserRepository(), new EncryptService(), new AdminRepository())
    )
  )

  // @HttpCode(200)
  // @Post('/signup/specialist')
  // public specialistSignUp(@Body() createUserDto: CreateUserDto) {
  //   return this._authService.signUp({ ...createUserDto, userType: 'specialist' })
  // }

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
