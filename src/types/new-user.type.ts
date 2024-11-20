import { userModel } from '@/models/user.model'

export type NewUser = Omit<typeof userModel.$inferInsert, 'createdAt' | 'updatedAt'>
