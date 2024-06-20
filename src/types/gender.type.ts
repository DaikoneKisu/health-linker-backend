export const GenderArray = ['masculine', 'feminine'] as const

export type Gender = (typeof GenderArray)[number]
