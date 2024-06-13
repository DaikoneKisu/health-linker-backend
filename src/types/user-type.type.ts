export const UserTypeArray = ['specialist', 'rural professional'] as const

export type UserType = (typeof UserTypeArray)[number]
