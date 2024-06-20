import { integer, pgTable, varchar, primaryKey, timestamp } from 'drizzle-orm/pg-core'
import { clinicalCaseModel } from './clinical-case.model'
import { specialistModel } from './specialist.model'

export const specialistMentorsClinicalCaseModel = pgTable(
  'specialists_mentor_clinical_cases',
  {
    clinicalCaseId: integer('clinical_case_id')
      .notNull()
      .references(() => clinicalCaseModel.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    specialistDocument: varchar('specialist_document')
      .notNull()
      .references(() => specialistModel.document, { onDelete: 'restrict', onUpdate: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
      .notNull()
      .$onUpdate(() => new Date())
      .defaultNow()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.clinicalCaseId, table.specialistDocument] })
  })
)
