import { pgTable, varchar, timestamp, serial, integer, text, pgEnum } from 'drizzle-orm/pg-core'
import { userModel } from './user.model'
import { chatRoomModel } from './chat-room.model'

export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'audio'])

export const chatMessageModel = pgTable('chat_message', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id')
    .notNull()
    .references(() => chatRoomModel.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  senderDocument: varchar('sender_document', { length: 10 })
    .notNull()
    .references(() => userModel.document, {
      onDelete: 'restrict',
      onUpdate: 'cascade'
    }),
  content: text('content').notNull(),
  messageType: messageTypeEnum('message_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow()
})
