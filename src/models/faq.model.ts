import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const faqModel = pgTable('frequently-asked-questions', {
  id: serial('id').primaryKey(),
  question: varchar('question').notNull(),
  answer: varchar('answer').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAd: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
