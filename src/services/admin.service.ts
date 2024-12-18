import { AdminCredentialsDto, CreateAdminDto, UpdateAdminDto } from '@/dtos/admin.dto'
import { ConflictError } from '@/exceptions/conflict-error'
import { AdminRepository } from '@/repositories/admin.repository'
import { ClinicalCaseFeedbackRepository } from '@/repositories/clinical-case-feedback.repository'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { UserRepository } from '@/repositories/user.repository'
import { EncryptService } from '@/services/encrypt.service'
import { Admin, NewAdmin, UpdateAdmin } from '@/types/admin.type'
import { Specialist } from '@/types/specialist.type'
import { isNotEmptyObject } from 'class-validator'
import { NotFoundError } from 'routing-controllers'
import { utils as SheetUtils } from 'xlsx'

export class AdminService {
  private readonly _adminRepository: AdminRepository
  private readonly _userRepository: UserRepository
  private readonly _encryptService: EncryptService
  private readonly _specialistRepository: SpecialistRepository
  private readonly _specialistMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository
  private readonly _clinicalCaseFeedbackRepository: ClinicalCaseFeedbackRepository

  constructor(
    adminRepository: AdminRepository,
    encryptService: EncryptService,
    userRepository: UserRepository,
    specialistRepository: SpecialistRepository,
    specialistMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository,
    clinicalCaseFeedbackRepository: ClinicalCaseFeedbackRepository
  ) {
    this._adminRepository = adminRepository
    this._encryptService = encryptService
    this._userRepository = userRepository
    this._specialistRepository = specialistRepository
    this._specialistMentorsClinicalCaseRepository = specialistMentorsClinicalCaseRepository
    this._clinicalCaseFeedbackRepository = clinicalCaseFeedbackRepository
  }

  public async getAllAdmins(query = '') {
    return await this._adminRepository.findAll(query)
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

  public async getSpecialistStats(document: Specialist['document']) {
    // Validate that document belongs to specialist
    const specialist = await this._specialistRepository.find(document)
    if (!specialist) {
      throw new NotFoundError('El especialista especificado no existe')
    }

    const [mentoredCount, feedbackList] = await Promise.all([
      this._specialistMentorsClinicalCaseRepository.findCountTotal(document),
      this._clinicalCaseFeedbackRepository.findByUser(document)
    ])

    const excelContent = [
      ['Especialista:', specialist.fullName],
      ['Casos atendidos:', mentoredCount],
      ['Retroalimentaciones:', specialist.feedbackCount],
      [''],
      ['ID del caso', 'Descripción del Caso', 'Fecha de Retroalimentación', 'Retroalimentación'],
      ...feedbackList.map((feedback) => [
        feedback.clinicalCaseId,
        feedback.clinicalCaseDescription,
        feedback.createdAt,
        feedback.text
      ])
    ]

    const worksheet = SheetUtils.aoa_to_sheet(excelContent)
    const workbook = SheetUtils.book_new()
    SheetUtils.book_append_sheet(workbook, worksheet, 'Estadísticas HealthLinker')
    return workbook
  }

  public async createAdmin(createAdminDto: CreateAdminDto) {
    const admin = await this.getAdmin(createAdminDto.email)
    const userByEmail = await this._userRepository.findByEmail(createAdminDto.email)

    if (admin || userByEmail) {
      //! This could be a security risk, as it could allow an attacker to enumerate admins (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
      //TODO: Implement a way to handle consistently the error message for both existent and non-existent admins
      throw new ConflictError('El administrador con el email provisto ya está registrado.')
    }

    const newAdmin: NewAdmin = {
      email: createAdminDto.email,
      fullName: createAdminDto.fullName,
      password: await this._encryptService.encryptPassword(createAdminDto.password)
    }

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

  public async signInAdmin(adminDto: AdminCredentialsDto) {
    return await this._adminRepository.signIn(adminDto.email, adminDto.password)
  }
}
