import { chatMessageModel } from '@/models/chat-message.model'

export type ChatMessage = typeof chatMessageModel.$inferSelect

export type NewChatMessage = Omit<typeof chatMessageModel.$inferSelect, 'id' | 'createdAt'>
