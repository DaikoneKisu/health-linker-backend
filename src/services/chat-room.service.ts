import { SpecialistService } from './specialist.service'
import { UnprocessableContentError } from '@/exceptions/unprocessable-content-error'
import { Specialist } from '@/types/specialist.type'
import { ChatRoomRepository } from '@/repositories/chat-room.repository'
import { CreateChatRoomDto } from '@/dtos/chat-room.dto'
import { ChatRoom } from '@/types/chat-room.type'

export class ChatRoomService {
  private readonly _chatRoomRepository: ChatRoomRepository
  private readonly _specialistService: SpecialistService

  constructor(chatRoomRepository: ChatRoomRepository, specialistService: SpecialistService) {
    this._chatRoomRepository = chatRoomRepository
    this._specialistService = specialistService
  }

  public async getAllChatRooms() {
    return await this._chatRoomRepository.findAll()
  }

  public async getPaginatedChatRooms(page: number = 1, size: number = 10) {
    return await this._chatRoomRepository.findWithLimitAndOffset(size, page - 1)
  }

  public async getSingleChatRoom(id: ChatRoom['id']) {
    return await this._chatRoomRepository.findById(id)
  }

  public async createChatRoom(
    createChatRoomDto: CreateChatRoomDto,
    creatorDocument: Specialist['document']
  ) {
    const specialist = await this._specialistService.getSpecialist(creatorDocument)
    if (!specialist) {
      throw new UnprocessableContentError(
        'El usuario que quiere crear la sala no es un especialista.'
      )
    }

    return await this._chatRoomRepository.create({
      roomName: createChatRoomDto.roomName,
      ownerDocument: creatorDocument
    })
  }

  public async deleteChatRoom(id: ChatRoom['id']) {
    return await this._chatRoomRepository.delete(id)
  }
}
