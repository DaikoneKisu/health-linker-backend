import { pgTable, varchar, timestamp, serial, integer, text } from 'drizzle-orm/pg-core'
import { userModel } from './user.model'
import { chatRoomModel } from './chat-room.model'

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
  media: text('media'),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
