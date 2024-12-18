import { newFaq } from '@/types/faq.type'
import { IsString, Length } from 'class-validator'

export class CreateFaqDto implements newFaq {
  @IsString()
  @Length(1, 500, {
    message: 'La pregunta solo puede contener 256 caracteres'
  })
  public question: string

  @IsString()
  @Length(1, 500, {
    message: 'La pregunta solo puede contener 256 caracteres'
  })
  public answer: string

  constructor(question: string, answer: string) {
    ;(this.question = question), (this.answer = answer)
  }
}
