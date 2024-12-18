import { IsInt, IsNumber, IsPositive } from 'class-validator'
import { PaginationQuery } from './pagination-query.dto'

export class ChatMessageQuery extends PaginationQuery {
  @IsPositive()
  @IsInt()
  @IsNumber()
  public caseId: number

  constructor(caseId: number, page?: number, size?: number) {
    super(page, size)
    this.caseId = caseId
  }
}
