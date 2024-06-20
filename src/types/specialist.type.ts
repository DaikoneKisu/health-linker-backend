import { specialistModel } from '@/models/specialist.model'

export type Specialist = typeof specialistModel.$inferSelect

export type NewSpecialist = Omit<typeof specialistModel.$inferInsert, 'createdAt' | 'updatedAt'>

export type FindSpecialist = Omit<Specialist, 'createdAt' | 'updatedAt'>

export type UpdateSpecialist = Omit<Partial<Specialist>, 'document' | 'createdAt' | 'updatedAt'>
