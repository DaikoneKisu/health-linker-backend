import { specialistMentorsClinicalCaseModel } from '@/models/specialist-mentors-clinical-case.model'

export type SpecialistMentorsClinicalCase = typeof specialistMentorsClinicalCaseModel.$inferSelect

export type NewSpecialistMentorsClinicalCase = Omit<
  typeof specialistMentorsClinicalCaseModel.$inferInsert,
  'createdAt' | 'updatedAt'
>

export type FindSpecialistMentorsClinicalCase = Omit<
  SpecialistMentorsClinicalCase,
  'createdAt' | 'updatedAt'
>

export type UpdateSpecialistMentorsClinicalCase = Omit<
  Partial<SpecialistMentorsClinicalCase>,
  'createdAt' | 'updatedAt'
>
