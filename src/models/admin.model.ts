import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'

export const adminModel = pgTable('admins', {
  email: varchar('email', { length: 254 }).primaryKey(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  password: varchar('password', { length: 60 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
