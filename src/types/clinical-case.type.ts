import { clinicalCaseModel } from '@/models/clinical-case.model'

export type ClinicalCase = typeof clinicalCaseModel.$inferSelect

export type NewClinicalCase = Omit<
  typeof clinicalCaseModel.$inferInsert,
  'id' | 'isClosed' | 'isPublic' | 'createdAt' | 'updatedAt'
>

export type FindClinicalCase = Omit<ClinicalCase, 'createdAt' | 'updatedAt'>

export type UpdateClinicalCase = Omit<Partial<ClinicalCase>, 'id' | 'createdAt' | 'updatedAt'>
