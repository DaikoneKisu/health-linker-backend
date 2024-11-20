import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core'
import { adminModel } from './admin.model'
import { specialistModel } from './specialist.model'

export const educationalResourceModel = pgTable('educational_resources', {
  id: serial('id').primaryKey(),
  authorEmail: varchar('author_email').references(() => adminModel.email, {
    onDelete: 'restrict',
    onUpdate: 'cascade'
  }),
  authorDocument: varchar('author_document').references(() => specialistModel.document, {
    onDelete: 'restrict',
    onUpdate: 'cascade'
  }),
  title: varchar('title').notNull(),
  content: varchar('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
