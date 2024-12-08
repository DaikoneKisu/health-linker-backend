import { desc, eq } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { chatMessageModel } from '@/models/chat-message.model'
import { userModel } from '@/models/user.model'
import { NewChatMessage } from '@/types/chat-message.type'

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
