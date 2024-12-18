import { PositiveNumericIdDto } from '@/dtos/common.dto'
import { CreateFaqDto } from '@/dtos/faq.dto'
import { FAQRepository } from '@/repositories/faq.repository'
import { Body, Delete, Get, HttpCode, JsonController, Params, Post } from 'routing-controllers'

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

  @HttpCode(200)
  @Delete('/:id')
  public delete(@Params() { id }: PositiveNumericIdDto) {
    return this._faqRepository.delete(id)
  }
}
