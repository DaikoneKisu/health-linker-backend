import { AdminRepository } from '@/repositories/admin.repository'
import { ChatMessageRepository } from '@/repositories/chat-message.repository'
import { ClinicalCaseFeedbackRepository } from '@/repositories/clinical-case-feedback.repository'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import { UserRepository } from '@/repositories/user.repository'
import { FindAdmin } from '@/types/admin.type'
import { FindUser } from '@/types/find-user.type'

export class NotificationsService {
  private readonly _userRepository: UserRepository
  private readonly _adminRepository: AdminRepository
  private readonly _feedbackRepository: ClinicalCaseFeedbackRepository
  private readonly _chatMessageRepository: ChatMessageRepository
  private readonly _specialistMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository
  private readonly _clinicalCaseRepository: ClinicalCaseRepository

  constructor(
    userRepository: UserRepository,
    adminRepository: AdminRepository,
    feedbackRepository: ClinicalCaseFeedbackRepository,
    chatMessageRepository: ChatMessageRepository,
    specialistMentorsClinicalCaseRepository: SpecialistMentorsClinicalCaseRepository,
    clinicalCaseRepository: ClinicalCaseRepository
  ) {
    this._userRepository = userRepository
    this._adminRepository = adminRepository
    this._feedbackRepository = feedbackRepository
    this._chatMessageRepository = chatMessageRepository
    this._specialistMentorsClinicalCaseRepository = specialistMentorsClinicalCaseRepository
    this._clinicalCaseRepository = clinicalCaseRepository
  }

  public async updateLastOnlineUser(document: FindUser['document']) {
    return await this._userRepository.updateLastOnline(document)
  }

  public async updateLastOnlineAdmin(email: FindAdmin['email']) {
    return await this._adminRepository.updateLastOnline(email)
  }

  public async getNotificationsRural(document: FindUser['document']) {
    const [feedbackCount, messagesCount] = await Promise.all([
      this.getFeedbackNotificationsCountRural(document),
      this.getMessagesNotificationsCountRural(document)
    ])

    return {
      feedbackCount: feedbackCount ?? 0,
      messagesCount: messagesCount ?? 0
    }
  }

  public async getNotificationsSpecialist(document: FindUser['document']) {
    const [assignedCasesCount, messagesCount] = await Promise.all([
      this.getAssignedCasesNotificationsCount(document),
      this.getMessagesNotificationsCountSpecialist(document)
    ])

    return {
      assignedCasesCount: assignedCasesCount ?? 0,
      messagesCount: messagesCount ?? 0
    }
  }

  public async getNotificationsAdmin(email: FindAdmin['email']) {
    const [newCasesCount] = await Promise.all([this.getNewCasesNotificationsCount(email)])

    return {
      newCasesCount: newCasesCount ?? 0
    }
  }

  private async getFeedbackNotificationsCountRural(document: FindUser['document']) {
    const lastOnlineDate = await this._userRepository.findLastOnline(document)
    if (!lastOnlineDate) return 0

    return await this._feedbackRepository.findCountNotSeenRural(document, lastOnlineDate)
  }

  private async getMessagesNotificationsCountRural(document: FindUser['document']) {
    const lastOnlineDate = await this._userRepository.findLastOnline(document)
    if (!lastOnlineDate) return 0

    return await this._chatMessageRepository.findCountNotReadRural(document, lastOnlineDate)
  }

  private async getMessagesNotificationsCountSpecialist(document: FindUser['document']) {
    const lastOnlineDate = await this._userRepository.findLastOnline(document)
    if (!lastOnlineDate) return 0

    return await this._chatMessageRepository.findCountNotReadSpecialist(document, lastOnlineDate)
  }

  private async getAssignedCasesNotificationsCount(document: FindUser['document']) {
    const lastOnlineDate = await this._userRepository.findLastOnline(document)
    if (!lastOnlineDate) return 0

    return await this._specialistMentorsClinicalCaseRepository.findCountNotSeen(
      document,
      lastOnlineDate
    )
  }

  private async getNewCasesNotificationsCount(email: FindAdmin['email']) {
    const lastOnlineDate = await this._adminRepository.getLastOnline(email)
    if (!lastOnlineDate) return 0

    return await this._clinicalCaseRepository.findCountNotSeenAdmin(lastOnlineDate)
  }
}
