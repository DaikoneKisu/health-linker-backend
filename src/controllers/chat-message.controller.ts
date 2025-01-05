import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Post,
  QueryParams,
  UploadedFile
} from 'routing-controllers'
import { acceptedFileFormats, fileUploadOptions } from '@/config/multer'
import { File } from '@/types/file.type'
import { DOMAIN, PUBLIC_PATH } from '@/config/env'
import { ChatMessageService } from '@/services/chat-message.service'
import { ChatMessageRepository } from '@/repositories/chat-message.repository'
import { ChatMessageQuery } from '@/dtos/chat-message-query.dto'
import { CreateChatMessageDto } from '@/dtos/chat-message.dto'
import { FindUser } from '@/types/find-user.type'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'

@JsonController('/chat-messages')
export class ChatMessageController {
  private readonly _chatMessageService = new ChatMessageService(
    new ChatMessageRepository(),
    new ClinicalCaseRepository(),
    new SpecialistMentorsClinicalCaseRepository()
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: ChatMessageQuery) {
    return this._chatMessageService.getPaginatedChatMessages(
      paginationQuery.page,
      paginationQuery.size,
      paginationQuery.caseId
    )
  }

  @HttpCode(201)
  @Post()
  @OnUndefined(404)
  public createMessage(
    @Body() createMessageDto: CreateChatMessageDto,
    @CurrentUser() { document }: FindUser
  ) {
    return this._chatMessageService.createMessage(createMessageDto, document)
  }

  @HttpCode(201)
  @Post('/files')
  public createFile(@UploadedFile('file', { options: fileUploadOptions }) file: File | undefined) {
    if (!file) {
      throw new BadRequestError(
        `No se envió un archivo o el formato del archivo no es aceptado. Los formatos de archivos aceptados son: ${acceptedFileFormats.join(', ')}`
      )
    }

    return { fileName: `${DOMAIN}/${PUBLIC_PATH}/${file.filename}` }
  }
}
