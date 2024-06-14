import { CreateAdminDto, UpdateAdminDto } from '@/dtos/admin.dto'
import { ConflictError } from '@/exceptions/conflict-error'
import { AdminRepository } from '@/repositories/admin.repository'
import { EncryptService } from '@/services/encrypt.service'
import { Admin, NewAdmin, UpdateAdmin } from '@/types/admin.type'
import { isNotEmptyObject } from 'class-validator'

export class AdminService {
  private readonly _adminRepository: AdminRepository
  private readonly _encryptService: EncryptService

  constructor(adminRepository: AdminRepository, encryptService: EncryptService) {
    this._adminRepository = adminRepository
    this._encryptService = encryptService
  }

  public async getAllAdmins() {
    return await this._adminRepository.findAll()
  }

  public async getAdmin(email: Admin['email']) {
    return await this._adminRepository.find(email)
  }

  public async getPaginatedAdmins(page: number = 1, size: number = 10) {
    return await this._adminRepository.findWithLimitAndOffset(size, page - 1)
  }

  public async getPassword(email: Admin['email']) {
    return await this._adminRepository.getPassword(email)
  }

  public async createAdmin(createAdminDto: CreateAdminDto) {
    const admin = await this.getAdmin(createAdminDto.email)

    if (admin) {
      //! This could be a security risk, as it could allow an attacker to enumerate admins (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
      //TODO: Implement a way to handle consistently the error message for both existent and non-existent admins
      throw new ConflictError('El administrador con el email provisto ya está registrado.')
    }

    const newAdmin: NewAdmin = {
      email: createAdminDto.email,
      fullName: createAdminDto.fullName,
      password: await this._encryptService.encryptPassword(createAdminDto.password)
    }

    //TODO: Check if admin is not user via email

    //TODO: Handle case when AdminRespository.create returns undefined
    return await this._adminRepository.create(newAdmin)
  }

  public async updateAdmin(email: Admin['email'], updateAdminDto: UpdateAdminDto) {
    const updateAdmin: UpdateAdmin = {}

    if (updateAdminDto.fullName) {
      updateAdmin.fullName = updateAdminDto.fullName
    }

    if (updateAdminDto.password) {
      updateAdmin.password = await this._encryptService.encryptPassword(updateAdminDto.password)
    }

    if (!isNotEmptyObject(updateAdmin)) {
      return 'No se enviaron datos para actualizar.'
    }

    //TODO: Handle case when AdminRespository.update returns undefined
    return await this._adminRepository.update(email, updateAdmin)
  }

  public async deleteAdmin(email: Admin['email']) {
    //TODO: Handle case when AdminRespository.delete returns undefined
    return await this._adminRepository.delete(email)
  }
}
