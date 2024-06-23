import { clinicalCaseFileModel } from '@/models/clinical-case-file.model'

export type ClinicalCaseFile = typeof clinicalCaseFileModel.$inferSelect

export type NewClinicalCaseFile = Omit<ClinicalCaseFile, 'id' | 'createdAt' | 'updatedAt'>

export type FindClinicalCaseFile = Omit<ClinicalCaseFile, 'createdAt' | 'updatedAt'>

export type UpdateClinicalCaseFile = Omit<
  Partial<ClinicalCaseFile>,
  'id' | 'createdAt' | 'updatedAt'
>
