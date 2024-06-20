import { integer, pgTable, timestamp, varchar, primaryKey, text } from 'drizzle-orm/pg-core'
import { clinicalCaseModel } from './clinical-case.model'
import { userModel } from './user.model'

export const clinicalCaseFeedbackModel = pgTable(
  'clinical_cases_feedbacks',
  {
    id: integer('id').notNull(),
    clinicalCaseId: integer('clinical_case_id')
      .notNull()
      .references(() => clinicalCaseModel.id, {
        onUpdate: 'cascade',
        onDelete: 'restrict'
      }),
    userDocument: varchar('user_document', { length: 10 })
      .notNull()
      .references(() => userModel.document, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
      }),
    text: text('text').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
      .notNull()
      .$onUpdate(() => new Date())
      .defaultNow()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.clinicalCaseId, table.userDocument] })
  })
)
