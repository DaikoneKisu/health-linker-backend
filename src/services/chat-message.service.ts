import { ChatMessageRepository } from '@/repositories/chat-message.repository'
import { CreateChatMessageDto } from '@/dtos/chat-message.dto'
import { User } from '@/types/user.type'
import { app } from '@/server'

export class ChatMessageService {
  private readonly _chatMessageRepository: ChatMessageRepository

  constructor(chatMessageRepository: ChatMessageRepository) {
    this._chatMessageRepository = chatMessageRepository
  }

  public async getPaginatedChatMessages(page: number = 1, size: number = 20, caseId: number) {
    return (
      await this._chatMessageRepository.findWithLimitAndOffset(size, page - 1, caseId)
    ).reverse()
  }

  public async createMessage(
    createChatMessageDto: CreateChatMessageDto,
    senderDocument: User['document']
  ) {
    const result = await this._chatMessageRepository.create({
      caseId: createChatMessageDto.caseId,
      content: createChatMessageDto.content,
      messageType: createChatMessageDto.messageType,
      senderDocument
    })

    if (result) {
      // Notify through server socket
      app.socketProvider.sendMessage(`new-message-${createChatMessageDto.caseId}`, result)
    }

    return result
  }
}
