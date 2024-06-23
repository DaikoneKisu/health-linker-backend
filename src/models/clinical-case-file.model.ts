import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { clinicalCaseModel } from './clinical-case.model'

export const clinicalCaseFileModel = pgTable('clinical_cases_files', {
  id: serial('id').primaryKey(),
  link: text('link').notNull(),
  clinicalCaseId: integer('clinical_case_id')
    .notNull()
    .references(() => clinicalCaseModel.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
