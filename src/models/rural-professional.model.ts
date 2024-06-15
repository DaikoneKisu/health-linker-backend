import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'
import { userModel } from '@/models/user.model'

export const ruralProfessionalModel = pgTable('rural_professionals', {
  document: varchar('document', { length: 10 })
    .primaryKey()
    .references(() => userModel.document, { onUpdate: 'cascade', onDelete: 'cascade' }),
  zone: varchar('zone', { length: 256 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
