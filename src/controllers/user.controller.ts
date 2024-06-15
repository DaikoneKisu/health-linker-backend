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
import { UserRepository } from '@/repositories/user.repository'
import { User } from '@/types/user.type'
import { CreateUserDto, UpdateUserDto } from '@/dtos/user.dto'
import { EncryptService } from '@/services/encrypt.service'
import { AdminRepository } from '@/repositories/admin.repository'
import { PaginationQuery } from '@/dtos/pagination-query.dto'

//TODO: Make validations reject on not specified fields
@JsonController('/users')
export class UserController {
  private readonly _userService: UserService = new UserService(
    new UserRepository(),
    new EncryptService(),
    new AdminRepository()
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
  @Get('/:document')
  @OnUndefined(404)
  public getOne(@Param('document') document: User['document']) {
    return this._userService.getUser(document)
  }

  @HttpCode(201)
  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this._userService.createUser(createUserDto)
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
