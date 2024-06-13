import { userModel } from '@/models/user.model'

export type UpdateUser = Partial<
  Omit<typeof userModel.$inferInsert, 'document' | 'createdAt' | 'updatedAt' | 'userType'>
>
