import { IsOptional, IsString } from 'class-validator'
import { PaginationQuery } from './pagination-query.dto'

export class EducationalPaginationDto extends PaginationQuery {
  @IsString()
  @IsOptional()
  public query?: string

  constructor(page?: number, size?: number, query?: string) {
    super(page, size)
    this.query = query
  }
}
