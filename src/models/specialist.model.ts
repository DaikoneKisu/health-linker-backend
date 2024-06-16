import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'
import { userModel } from '@/models/user.model'
import { specialtyModel } from '@/models/specialty.model'

export const specialistModel = pgTable('specialists', {
  document: varchar('document', { length: 10 })
    .primaryKey()
    .references(() => userModel.document, { onUpdate: 'cascade', onDelete: 'cascade' }),
  specialtyId: integer('specialty_id')
    .notNull()
    .references(() => specialtyModel.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
