import { EnvError, makeValidator } from 'envalid'

export const nat = makeValidator<number>((input: string) => {
  const coerced = parseInt(input, 10)
  if (Number.isNaN(coerced) || coerced <= 0) throw new EnvError(`Invalid natural input: "${input}"`)
  return coerced
})
