import {
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Params,
  Post,
  QueryParams
} from 'routing-controllers'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { PaginationQuery } from '@/dtos/pagination-query.dto'
import { FindUser } from '@/types/find-user.type'
import { PositiveNumericIdDto } from '@/dtos/common.dto'
import { SpecialistService } from '@/services/specialist.service'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { ChatRoomService } from '@/services/chat-room.service'
import { ChatRoomRepository } from '@/repositories/chat-room.repository'
import { CreateChatRoomDto } from '@/dtos/chat-room.dto'

@JsonController('/chat-rooms')
export class ChatRoomController {
  private readonly _chatRoomService = new ChatRoomService(
    new ChatRoomRepository(),
    new SpecialistService(
      new SpecialistRepository(),
      new UserService(new UserRepository(), new EncryptService(), new AdminRepository()),
      new SpecialtyRepository()
    )
  )

  @HttpCode(200)
  @Get()
  public getPaginated(@QueryParams() paginationQuery: PaginationQuery) {
    return this._chatRoomService.getPaginatedChatRooms(paginationQuery.page, paginationQuery.size)
  }

  @HttpCode(201)
  @Post()
  public create(
    @Body() createChatRoomDto: CreateChatRoomDto,
    @CurrentUser() { document }: FindUser
  ) {
    return this._chatRoomService.createChatRoom(createChatRoomDto, document)
  }

  @HttpCode(200)
  @Delete('/:id')
  public delete(@Params() { id }: PositiveNumericIdDto) {
    return this._chatRoomService.deleteChatRoom(id)
  }
}
