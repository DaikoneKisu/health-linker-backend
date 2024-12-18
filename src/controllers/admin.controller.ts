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
  QueryParams,
  Res
} from 'routing-controllers'
import { AdminRepository } from '@/repositories/admin.repository'
import { AdminService } from '@/services/admin.service'
import { EncryptService } from '@/services/encrypt.service'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { Admin } from '@/types/admin.type'
import { AdminCredentialsDto, CreateAdminDto, UpdateAdminDto } from '@/dtos/admin.dto'
import { UserRepository } from '@/repositories/user.repository'
import { AllUsersSearchQuery } from '@/dtos/all-users-search-query.dto'
import { Specialist } from '@/types/specialist.type'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import { ClinicalCaseFeedbackRepository } from '@/repositories/clinical-case-feedback.repository'
import { write } from 'xlsx'
import express from 'express'

@JsonController('/admins')
export class AdminController {
  private readonly _adminService: AdminService = new AdminService(
    new AdminRepository(new EncryptService()),
    new EncryptService(),
    new UserRepository(),
    new SpecialistRepository(),
    new SpecialistMentorsClinicalCaseRepository(),
    new ClinicalCaseFeedbackRepository()
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._adminService.getPaginatedAdmins(paginationQuery.page, paginationQuery.size)
  }

  @HttpCode(200)
  @Get('/all')
  public getAll(@QueryParams() searchQuery: AllUsersSearchQuery) {
    return this._adminService.getAllAdmins(searchQuery.query)
  }

  @HttpCode(200)
  @Get('/:email')
  @OnUndefined(404)
  public getOne(@Param('email') email: Admin['email']) {
    return this._adminService.getAdmin(email)
  }

  @HttpCode(200)
  @Get('/stats/specialist/:document')
  public async getSpecialistStats(
    @Param('document') document: Specialist['document'],
    @Res() response: express.Response
  ) {
    const wb = await this._adminService.getSpecialistStats(document)
    const buf = write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
    response.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=data.xlsx'
    })

    return response.end(buf)
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
