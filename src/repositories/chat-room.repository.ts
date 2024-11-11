import { eq } from 'drizzle-orm'
import { PgDatabase } from '@/types/pg-database.type'
import { pgDatabase } from '@/pg-database'
import { chatRoomModel } from '@/models/chat-room.model'
import { ChatRoom, NewChatRoom } from '@/types/chat-room.type'

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
    return await this._db
      .select({
        id: chatRoomModel.id,
        roomName: chatRoomModel.roomName,
        ownerDocument: chatRoomModel.ownerDocument
      })
      .from(chatRoomModel)
      .limit(limit)
      .offset(limit * offset)
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
