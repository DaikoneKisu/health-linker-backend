import { chatRoomModel } from '@/models/chat-room.model'

export type ChatRoom = typeof chatRoomModel.$inferSelect

export type NewChatRoom = Omit<typeof chatRoomModel.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>

export type FindChatRoom = Omit<ChatRoom, 'createdAt' | 'updatedAt'>

export type UpdateChatRoom = Omit<Partial<ChatRoom>, 'id' | 'createdAt' | 'updatedAt'>
