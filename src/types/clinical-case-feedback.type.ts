import { clinicalCaseFeedbackModel } from '@/models/clinical-case-feedback.model'

export type ClinicalCaseFeedback = typeof clinicalCaseFeedbackModel.$inferSelect

export type NewClinicalCaseFeedback = Omit<
  typeof clinicalCaseFeedbackModel.$inferInsert,
  'createdAt' | 'updatedAt'
>

export type FindClinicalCaseFeedback = ClinicalCaseFeedback

export type UpdateClinicalCaseFeedback = Omit<
  Partial<ClinicalCaseFeedback>,
  'id' | 'userDocument' | 'clinicalCaseId' | 'createdAt' | 'updatedAt'
>
