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
import { AdminRepository } from '@/repositories/admin.repository'
import { AdminService } from '@/services/admin.service'
import { EncryptService } from '@/services/encrypt.service'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { Admin } from '@/types/admin.type'
import { AdminCredentialsDto, CreateAdminDto, UpdateAdminDto } from '@/dtos/admin.dto'
import { UserRepository } from '@/repositories/user.repository'

@JsonController('/admins')
export class AdminController {
  private readonly _adminService: AdminService = new AdminService(
    new AdminRepository(new EncryptService()),
    new EncryptService(),
    new UserRepository()
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._adminService.getPaginatedAdmins(paginationQuery.page, paginationQuery.size)
  }

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._adminService.getAllAdmins()
  }

  @HttpCode(200)
  @Get('/:email')
  @OnUndefined(404)
  public getOne(@Param('email') email: Admin['email']) {
    return this._adminService.getAdmin(email)
  }

  @HttpCode(201)
  @Post()
  public create(@Body() createAdminDto: CreateAdminDto) {
    return this._adminService.createAdmin(createAdminDto)
  }

  @HttpCode(200)
  @Patch('/:email')
  public update(@Body() updateAdminDto: UpdateAdminDto, @Param('email') email: Admin['email']) {
    return this._adminService.updateAdmin(email, updateAdminDto)
  }

  @HttpCode(200)
  @Delete('/:email')
  public delete(@Param('email') email: Admin['email']) {
    return this._adminService.deleteAdmin(email)
  }

  @HttpCode(200)
  @Post('/signin')
  public signIn(@Body() signInAdminDto: AdminCredentialsDto) {
    return this._adminService.signInAdmin(signInAdminDto)
  }
}
