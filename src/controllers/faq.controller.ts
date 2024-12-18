import { PositiveNumericIdDto } from '@/dtos/common.dto'
import { CreateFaqDto } from '@/dtos/faq.dto'
import { FAQRepository } from '@/repositories/faq.repository'
import { FindAdmin } from '@/types/admin.type'
import { FindUser } from '@/types/find-user.type'
import { AdminRepository } from '@/repositories/admin.repository'
import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Params,
  Post,
  UnauthorizedError
} from 'routing-controllers'
import { EncryptService } from '@/services/encrypt.service'

@JsonController('/faq')
export class FAQController {
  private readonly _faqRepository: FAQRepository = new FAQRepository()
  private readonly _encryptService = new EncryptService()
  private readonly _adminRepository: AdminRepository = new AdminRepository(this._encryptService)
  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._faqRepository.findAll()
  }

  @HttpCode(200)
  @Post()
  public async create(
    @Body() createFaqDto: CreateFaqDto,
    @CurrentUser() user: FindUser | FindAdmin
  ) {
    if (!('document' in user)) {
      const admin = await this._adminRepository.find(user.email)
      if (!admin) {
        throw new UnauthorizedError('Only admins can create FAQs')
      }

      return this._faqRepository.create(createFaqDto)
    }
    throw new UnauthorizedError('Only admins can create FAQs')
  }

  @HttpCode(200)
  @Delete('/:id')
  public async delete(
    @Params() { id }: PositiveNumericIdDto,
    @CurrentUser() user: FindUser | FindAdmin
  ) {
    {
      if (!('document' in user)) {
        const admin = await this._adminRepository.find(user.email)
        if (!admin) {
          throw new UnauthorizedError('Administrador inválido')
        }
        return this._faqRepository.delete(id)
      }
      throw new UnauthorizedError('Solo los administradores pueden eliminar FAQs')
    }
  }
}
