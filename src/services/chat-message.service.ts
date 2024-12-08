import { ChatMessageRepository } from '@/repositories/chat-message.repository'
import { CreateChatMessageDto } from '@/dtos/chat-message.dto'
import { User } from '@/types/user.type'
import { app } from '@/server'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import { UnauthorizedError } from 'routing-controllers'

export class ChatMessageService {
  private readonly _chatMessageRepository: ChatMessageRepository
  private readonly _clinicalCaseRepository: ClinicalCaseRepository
  private readonly _specialistsMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository

  constructor(
    chatMessageRepository: ChatMessageRepository,
    clinicalCaseRepository: ClinicalCaseRepository,
    specialistsMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository
  ) {
    this._chatMessageRepository = chatMessageRepository
    this._clinicalCaseRepository = clinicalCaseRepository
    this._specialistsMentorsClinicalCaseRepository = specialistsMentorsClinicalCaseRepository
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
    // Validate that sender is either
    // - Rural professional that created the case
    // - Specialist that mentors the case
    const clinicalCase = await this._clinicalCaseRepository.find(createChatMessageDto.caseId)
    if (!clinicalCase) return undefined

    let canSend = false
    if (clinicalCase.ruralProfessionalDocument === senderDocument) {
      canSend = true
    }

    if (!canSend) {
      const specialistMentor =
        await this._specialistsMentorsClinicalCaseRepository.findManyByClinicalCase(
          createChatMessageDto.caseId
        )
      if (!specialistMentor?.some((sm) => sm.specialistDocument === senderDocument)) {
        throw new UnauthorizedError('No tienes permisos para enviar mensajes en este caso')
      }
    }

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
