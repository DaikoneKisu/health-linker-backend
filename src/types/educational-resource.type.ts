import { educationalResourceModel } from '@/models/educational-resource.model'

export type EducationalResource = typeof educationalResourceModel.$inferSelect

export type NewResourceAdmin = Omit<
  typeof educationalResourceModel.$inferInsert,
  'id' | 'createdAt' | 'updatedAt' | 'authorDocument'
>

export type NewResourceSpecialist = Omit<
  typeof educationalResourceModel.$inferInsert,
  'id' | 'createdAt' | 'updatedAt' | 'authorEmail'
>

export type EditResource = Omit<
  Partial<EducationalResource>,
  'id' | 'authorEmail' | 'authorDocument' | 'createdAt' | 'updatedAt'
>
