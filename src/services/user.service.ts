import { injectable } from 'inversify'
import { isNotEmptyObject } from 'class-validator'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { CreateUserDto, UpdateUserDto } from '@/dtos/user.dto'
import { User } from '@/types/user.type'
import { NewUser } from '@/types/new-user.type'
import { UpdateUser } from '@/types/update-user.type'
import { EncryptService } from '@/services/encrypt.service'
import { ConflictError } from '@/exceptions/conflict-error'
import { UserType } from '@/types/user-type.type'

@injectable()
export class UserService {
  private readonly _userRepository: UserRepository
  private readonly _adminRepository: AdminRepository
  private readonly _encryptService: EncryptService

  constructor(
    userRepository: UserRepository,
    encryptService: EncryptService,
    adminRepository: AdminRepository
  ) {
    this._userRepository = userRepository
    this._encryptService = encryptService
    this._adminRepository = adminRepository
  }

  public async getAllUsers() {
    return await this._userRepository.findAll()
  }

  public async getUser(document: User['document']) {
    return await this._userRepository.find(document)
  }

  public async getPaginatedUsers(page: number = 1, size: number = 10) {
    return await this._userRepository.findWithLimitAndOffset(size, page - 1)
  }

  public async getPassword(document: User['document']) {
    return await this._userRepository.getPassword(document)
  }

  public async createUser(createUserDto: CreateUserDto & { userType: UserType }) {
    const userByDocument = await this.getUser(createUserDto.document)
    const userByEmail = await this._userRepository.findByEmail(createUserDto.email)
    const admin = await this._adminRepository.find(createUserDto.email)

    if (userByDocument || userByEmail || admin) {
      //! This could be a security risk, as it could allow an attacker to enumerate users (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
      //TODO: Implement a way to handle consistently the error message for both existent and non-existent users
      throw new ConflictError(`El usuario con el documento y/o email provisto ya está registrado.`)
    }

    const newUser: NewUser = {
      document: createUserDto.document,
      email: createUserDto.email,
      fullName: createUserDto.fullName,
      phoneNumber: createUserDto.phoneNumber,
      password: await this._encryptService.encryptPassword(createUserDto.password),
      userType: createUserDto.userType
    }

    //TODO: Handle case when UserRespository.create returns undefined
    return await this._userRepository.create(newUser)
  }

  public async updateUser(document: User['document'], updateUserDto: UpdateUserDto) {
    const updateUser: UpdateUser = {}

    if (updateUserDto.email) {
      const userByEmail = await this._userRepository.findByEmail(updateUserDto.email)
      const admin = await this._adminRepository.find(updateUserDto.email)

      if (userByEmail || admin) {
        //! This could be a security risk, as it could allow an attacker to enumerate users (https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
        //TODO: Implement a way to handle consistently the error message for both existent and non-existent users
        throw new ConflictError(`El usuario con el email provisto ya está registrado.`)
      }
    }

    for (const key of ['email', 'fullName', 'phoneNumber', 'password'] as const) {
      if (!updateUserDto[key]) {
        continue
      }

      if (key === 'password' && updateUserDto['password']) {
        updateUser['password'] = await this._encryptService.encryptPassword(
          updateUserDto['password']
        )
        continue
      }

      updateUser[key] = updateUserDto[key]
    }

    if (!isNotEmptyObject(updateUser)) {
      return 'No se enviaron datos para actualizar.'
    }

    //TODO: Check if user is not admin via email

    //TODO: Handle case when UserRespository.update returns undefined
    return await this._userRepository.update(document, updateUser)
  }

  public async deleteUser(document: User['document']) {
    //TODO: Handle case when UserRespository.delete returns undefined
    return await this._userRepository.delete(document)
  }
}
