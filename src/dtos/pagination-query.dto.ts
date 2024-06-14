import { IsOptional, IsPositive } from 'class-validator'

export class PaginationQuery {
  @IsOptional()
  @IsPositive({
    message: `El parámetro 'page' debe ser un número positivo mayor que cero.`
  })
  public page?: number

  @IsOptional()
  @IsPositive({
    message: `El parámetro 'size' debe ser un número positivo mayor que cero.`
  })
  public size?: number

  constructor(page?: number, size?: number) {
    this.page = page
    this.size = size
  }
}
