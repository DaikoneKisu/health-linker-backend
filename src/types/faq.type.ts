import { faqModel } from '@/models/faq.model'

export type faq = typeof faqModel.$inferSelect

export type newFaq = Omit<faq, 'id' | 'createdAt' | 'updatedAt'>

export type findFaq = Omit<faq, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateFaq = Omit<Partial<faq>, 'id' | 'createdAt' | 'updatedAt'>
