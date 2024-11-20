import { pgTable, pgEnum, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'
import { UserTypeArray } from '@/types/user-type.type'

export const userTypeEnum = pgEnum('user_type_enum', UserTypeArray)

export const userModel = pgTable('users', {
  document: varchar('document', { length: 10 }).primaryKey(),
  email: varchar('email', { length: 254 }).unique().notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  password: varchar('password', { length: 60 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 15 }).notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
  userType: userTypeEnum('user_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
