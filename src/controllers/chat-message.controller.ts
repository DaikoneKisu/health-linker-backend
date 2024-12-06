import {
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Post,
  QueryParams,
  UploadedFile
} from 'routing-controllers'
import { acceptedFileFormats, fileUploadOptions } from '@/config/multer'
import { File } from '@/types/file.type'
import { DOMAIN, PUBLIC_PATH, PORT } from '@/config/env'
import { ChatMessageService } from '@/services/chat-message.service'
import { ChatMessageRepository } from '@/repositories/chat-message.repository'
import { ChatMessageQuery } from '@/dtos/chat-message-query.dto'
import { CreateChatMessageDto } from '@/dtos/chat-message.dto'
import { FindUser } from '@/types/find-user.type'

@JsonController('/chat-messages')
export class ChatMessageController {
  private readonly _chatMessageService = new ChatMessageService(new ChatMessageRepository())

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: ChatMessageQuery) {
    return this._chatMessageService.getPaginatedChatMessages(
      paginationQuery.page,
      paginationQuery.size,
      paginationQuery.roomId
    )
  }

  @HttpCode(201)
  @Post()
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

    return { fileName: `${DOMAIN}:${PORT}/${PUBLIC_PATH}/${file.filename}` }
  }
}
