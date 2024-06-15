import { specialtyModel } from '@/models/specialty.model'

export type Specialty = typeof specialtyModel.$inferSelect

export type NewSpecialty = Omit<
  typeof specialtyModel.$inferInsert,
  'id' | 'createdAt' | 'updatedAt'
>

export type FindSpecialty = Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateSpecialty = Omit<Partial<Specialty>, 'id' | 'createdAt' | 'updatedAt'>
