import { userModel } from '@/models/user.model'

export type User = typeof userModel.$inferSelect
