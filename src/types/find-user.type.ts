import { userModel } from '@/models/user.model'

export type FindUser = Omit<typeof userModel.$inferSelect, 'password' | 'createdAt' | 'updatedAt'>
