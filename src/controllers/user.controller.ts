import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Patch,
  Post,
  QueryParams
} from 'routing-controllers'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { SpecialistService } from '@/services/specialist.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { UpdateUserDto } from '@/dtos/user.dto'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { CreateSpecialistDto } from '@/dtos/specialist.dto'
import { CreateRuralProfessionalDto } from '@/dtos/rural-professional.dto'
import { User } from '@/types/user.type'
import { FindUser } from '@/types/find-user.type'

//TODO: Make validations reject on not specified fields
@JsonController('/users')
export class UserController {
  private readonly _userService: UserService = new UserService(
    new UserRepository(),
    new EncryptService(),
    new AdminRepository()
  )
  private readonly _ruralProfessionalService: RuralProfessionalService =
    new RuralProfessionalService(new RuralProfessionalRepository(), this._userService)
  private readonly _specialistService: SpecialistService = new SpecialistService(
    new SpecialistRepository(),
    this._userService,
    new SpecialtyRepository()
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._userService.getPaginatedUsers(paginationQuery.page, paginationQuery.size)
  }

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._userService.getAllUsers()
  }

  @HttpCode(200)
  @Get('/me')
  public getMe(@CurrentUser() user: FindUser) {
    return this._userService.getUser(user.document)
  }

  @HttpCode(200)
  @Get('/:document')
  @OnUndefined(404)
  public getOne(@Param('document') document: User['document']) {
    return this._userService.getUser(document)
  }

  @HttpCode(201)
  @Post('/specialist')
  public createSpecialist(@Body() createSpecialistDto: CreateSpecialistDto) {
    return this._specialistService.createSpecialist(createSpecialistDto)
  }

  @HttpCode(201)
  @Post('/rural-professional')
  public createRuralProfessional(@Body() createRuralProfessionalDto: CreateRuralProfessionalDto) {
    return this._ruralProfessionalService.createRuralProfessional(createRuralProfessionalDto)
  }

  @HttpCode(200)
  @Patch('/:document')
  public update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('document') document: User['document']
  ) {
    return this._userService.updateUser(document, updateUserDto)
  }

  @HttpCode(200)
  @Delete('/:document')
  public delete(@Param('document') document: User['document']) {
    return this._userService.deleteUser(document)
  }
}
