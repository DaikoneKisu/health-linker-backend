import { adminModel } from '@/models/admin.model'

export type Admin = typeof adminModel.$inferSelect

export type NewAdmin = Omit<typeof adminModel.$inferInsert, 'createdAt' | 'updatedAt'>

export type FindAdmin = Omit<Admin, 'password' | 'createdAt' | 'updatedAt'>

export type UpdateAdmin = Omit<Partial<Admin>, 'email' | 'createdAt' | 'updatedAt'>
