import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { GenderArray } from '@/types/gender.type'
import { specialtyModel } from './specialty.model'
import { ruralProfessionalModel } from './rural-professional.model'

export const genderEnum = pgEnum('gender_enum', GenderArray)

export const clinicalCaseModel = pgTable('clinical_cases', {
  id: serial('id').primaryKey(),
  description: text('description').notNull(),
  reason: text('reason').notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  isClosed: boolean('is_closed').notNull().default(false),
  patientBirthdate: timestamp('patient_birthdate').notNull(),
  patientGender: genderEnum('patient_gender').notNull(),
  patientReason: text('patient_reason').notNull(),
  patientAssessment: text('patient_assessment').notNull(),
  requiredSpecialtyId: integer('required_specialty_id')
    .notNull()
    .references(() => specialtyModel.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  ruralProfessionalDocument: varchar('rural_professional_document', { length: 10 })
    .notNull()
    .references(() => ruralProfessionalModel.document, {
      onDelete: 'restrict',
      onUpdate: 'cascade'
    }),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6 })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow()
})
