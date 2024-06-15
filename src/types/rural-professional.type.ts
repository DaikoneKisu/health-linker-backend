import { ruralProfessionalModel } from '@/models/rural-professional.model'

export type RuralProfessional = typeof ruralProfessionalModel.$inferSelect

export type NewRuralProfessional = Omit<
  typeof ruralProfessionalModel.$inferInsert,
  'createdAt' | 'updatedAt'
>

export type FindRuralProfessional = Omit<RuralProfessional, 'createdAt' | 'updatedAt'>

export type UpdateRuralProfessional = Omit<
  Partial<RuralProfessional>,
  'document' | 'createdAt' | 'updatedAt'
>
