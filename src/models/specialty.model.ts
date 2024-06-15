import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const specialtyModel = pgTable('specialties', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
