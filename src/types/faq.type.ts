import { faqModel } from '@/models/faq.model'

export type faq = typeof faqModel.$inferInsert

export type newFaq = Omit<faq, 'id' | 'createdAt' | 'updatedAt'>
