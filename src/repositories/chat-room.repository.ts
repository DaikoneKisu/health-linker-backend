import { desc, eq } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { chatRoomModel } from '@/models/chat-room.model'
import { ChatRoom, NewChatRoom } from '@/types/chat-room.type'
import { chatMessageModel } from '@/models/chat-message.model'

export class ChatRoomRepository {
  private readonly _db: PgDatabase = pgDatabase

  /**
   * Get all available chat rooms
   */
  public async findAll() {
    return await this._db
      .select({
        id: chatRoomModel.id,
        roomName: chatRoomModel.roomName,
        ownerDocument: chatRoomModel.ownerDocument
      })
      .from(chatRoomModel)
  }

  /**
   * Get chat rooms with pagination support
   * @param limit Amount of chat rooms to show
   * @param offset Offset from start
   */
  public async findWithLimitAndOffset(limit: number, offset: number) {
    const lastMessageSubquery = this._db
      .select({
        roomId: chatMessageModel.roomId,
        content: chatMessageModel.content,
        messageType: chatMessageModel.messageType,
        createdAt: chatMessageModel.createdAt
      })
      .from(chatMessageModel)
      .orderBy(desc(chatMessageModel.createdAt))
      .groupBy(
        chatMessageModel.roomId,
        chatMessageModel.content,
        chatMessageModel.messageType,
        chatMessageModel.createdAt
      )
      .limit(1)
      .as('lastMessage')

    return await this._db
      .select({
        id: chatRoomModel.id,
        roomName: chatRoomModel.roomName,
        ownerDocument: chatRoomModel.ownerDocument,
        lastMessageContent: lastMessageSubquery.content,
        lastMessageType: lastMessageSubquery.messageType,
        lastMessageCreated: lastMessageSubquery.createdAt
      })
      .from(chatRoomModel)
      .leftJoin(lastMessageSubquery, eq(chatRoomModel.id, lastMessageSubquery.roomId))
      .limit(limit)
      .offset(limit * offset)
  }

  public async findById(id: ChatRoom['id']) {
    const rows = await this._db
      .select({
        id: chatRoomModel.id,
        roomName: chatRoomModel.roomName,
        ownerDocument: chatRoomModel.ownerDocument
      })
      .from(chatRoomModel)
      .where(eq(chatRoomModel.id, id))

    return rows.at(0)
  }

  /**
   * Inserts a new chat room
   * @param newChatRoom Chat room data
   */
  public async create(newChatRoom: NewChatRoom) {
    const rows = await this._db.insert(chatRoomModel).values(newChatRoom).returning({
      id: chatRoomModel.id,
      roomName: chatRoomModel.roomName,
      ownerDocument: chatRoomModel.ownerDocument
    })

    return rows.at(0)
  }

  /**
   * Delete a chat room
   * @param id ID of chat room to delete
   */
  public async delete(id: ChatRoom['id']) {
    const rows = await this._db.delete(chatRoomModel).where(eq(chatRoomModel.id, id)).returning({
      id: chatRoomModel.id,
      roomName: chatRoomModel.roomName
    })

    return rows.at(0)
  }
}
