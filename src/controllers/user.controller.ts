import {
  Body,
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
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { User } from '@/types/user.type'
import { UpdateUserDto } from '@/dtos/user.dto'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { CreateRuralProfessionalDto } from '@/dtos/rural-professional.dto'

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
  @Get('/:document')
  @OnUndefined(404)
  public getOne(@Param('document') document: User['document']) {
    return this._userService.getUser(document)
  }

  //TODO: create specialist
  // @HttpCode(201)
  // @Post('/create-specialist')
  // public createSpecialist(@Body() createUserDto: CreateUserDto) {
  //   return this._userService.createUser(createUserDto)
  // }

  @HttpCode(201)
  @Post('/create-rural-professional')
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
