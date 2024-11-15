import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core'
import { userModel } from './user.model'

export const chatRoomModel = pgTable('chat_rooms', {
  id: serial('id').primaryKey(),
  roomName: varchar('room_name', { length: 100 }).notNull(),
  ownerDocument: varchar('owner_document', { length: 10 })
    .notNull()
    .references(() => userModel.document, {
      onDelete: 'restrict',
      onUpdate: 'cascade'
    }),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
