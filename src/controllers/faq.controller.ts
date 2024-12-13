import { CreateFaqDto } from '@/dtos/faq.dto'
import { FAQRepository } from '@/repositories/faq.repository'
import { Body, Get, HttpCode, JsonController, Post } from 'routing-controllers'

@JsonController('/faq')
export class FAQController {
  private readonly _faqRepository: FAQRepository = new FAQRepository()

  @HttpCode(200)
  @Get('/all')
  public getAll() {
    return this._faqRepository.findAll()
  }

  @HttpCode(200)
  @Post()
  public create(@Body() createFaqDto: CreateFaqDto) {
    return this._faqRepository.create(createFaqDto)
  }
}
