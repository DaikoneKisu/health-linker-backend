import { Body, HttpCode, JsonController, Post } from 'routing-controllers'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { UserRepository } from '@/repositories/user.repository'
import { CreateUserDto, UserCredentialsDto } from '@/dtos/user.dto'

@JsonController('/auth')
export class AuthController {
  private readonly _authService: AuthService = new AuthService(
    new UserService(new UserRepository(), new EncryptService()),
    new EncryptService()
  )

  @HttpCode(200)
  @Post('/signup')
  public signUp(@Body() createUserDto: CreateUserDto) {
    return this._authService.signUp(createUserDto)
  }

  @HttpCode(200)
  @Post('/signin')
  public signIn(@Body() userCredentialsDto: UserCredentialsDto) {
    return this._authService.signIn(userCredentialsDto.document, userCredentialsDto.password)
  }
}
