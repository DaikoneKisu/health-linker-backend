import { and, count, desc, eq, gt, inArray } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { chatMessageModel } from '@/models/chat-message.model'
import { userModel } from '@/models/user.model'
import { NewChatMessage } from '@/types/chat-message.type'
import { FindUser } from '@/types/find-user.type'
import { clinicalCaseModel } from '@/models/clinical-case.model'
import { specialistMentorsClinicalCaseModel } from '@/models/specialist-mentors-clinical-case.model'

export class ChatMessageRepository {
  private readonly _db: PgDatabase = pgDatabase

  /**
   * Get chat messages with pagination support
   * @param limit Amount of chat rooms to show
   * @param offset Offset from start
   * @param caseId ID of the case to search in
   */
  public async findWithLimitAndOffset(limit: number, offset: number, caseId: number) {
    return await this._db
      .select({
        id: chatMessageModel.id,
        senderName: userModel.fullName,
        content: chatMessageModel.content,
        messageType: chatMessageModel.messageType,
        createdAt: chatMessageModel.createdAt
      })
      .from(chatMessageModel)
      .innerJoin(userModel, eq(userModel.document, chatMessageModel.senderDocument))
      .where(eq(chatMessageModel.caseId, caseId))
      .orderBy(desc(chatMessageModel.createdAt))
      .limit(limit)
      .offset(limit * offset)
  }

  /**
   * Find amount of not-read chat messages for a rural professional
   * @param userDocument Document of rural professional
   */
  public async findCountNotReadRural(userDocument: FindUser['document'], lastOnlineDate: Date) {
    const clinicalCasesRural = this._db
      .select({ id: clinicalCaseModel.id })
      .from(clinicalCaseModel)
      .where(
        and(
          eq(clinicalCaseModel.ruralProfessionalDocument, userDocument),
          eq(clinicalCaseModel.isClosed, false)
        )
      )

    const messages = await this._db
      .select({ count: count(chatMessageModel.id) })
      .from(chatMessageModel)
      .where(
        and(
          inArray(chatMessageModel.caseId, clinicalCasesRural),
          gt(chatMessageModel.createdAt, lastOnlineDate)
        )
      )

    return messages.at(0)?.count
  }

  public async findCountNotReadSpecialist(
    userDocument: FindUser['document'],
    lastOnlineDate: Date
  ) {
    const clinicalCasesSpecialist = this._db
      .selectDistinct({
        id: specialistMentorsClinicalCaseModel.clinicalCaseId
      })
      .from(specialistMentorsClinicalCaseModel)
      .where(
        and(
          eq(specialistMentorsClinicalCaseModel.specialistDocument, userDocument),
          eq(clinicalCaseModel.isClosed, false)
        )
      )

    const messages = await this._db
      .select({ count: count(chatMessageModel.id) })
      .from(chatMessageModel)
      .where(
        and(
          inArray(chatMessageModel.caseId, clinicalCasesSpecialist),
          gt(chatMessageModel.createdAt, lastOnlineDate)
        )
      )

    return messages.at(0)?.count
  }

  /**
   * Inserts a new chat message
   * @param newChatMessage Chat message data
   */
  public async create(newChatMessage: NewChatMessage) {
    const rows = await this._db.insert(chatMessageModel).values(newChatMessage).returning({
      id: chatMessageModel.id,
      content: chatMessageModel.content,
      messageType: chatMessageModel.messageType,
      createdAt: chatMessageModel.createdAt,
      senderDocument: chatMessageModel.senderDocument
    })

    const result = rows.at(0)
    if (result) {
      // Get sender's name
      const senderNameResult = await this._db
        .select({ senderName: userModel.fullName })
        .from(userModel)
        .where(eq(userModel.document, result.senderDocument))

      const senderName = String(senderNameResult.at(0)?.senderName)

      return {
        id: result.id,
        senderName,
        content: result.content,
        messageType: result.messageType,
        createdAt: result.createdAt
      }
    }

    return result
  }
}
