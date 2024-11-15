import { IsOptional, IsPositive } from 'class-validator'

export class PaginationQuery {
  @IsPositive({
    message: `El parámetro 'page' debe ser un número positivo mayor que cero.`
  })
  @IsOptional()
  public page?: number

  @IsPositive({
    message: `El parámetro 'size' debe ser un número positivo mayor que cero.`
  })
  @IsOptional()
  public size?: number

  constructor(page?: number, size?: number) {
    this.page = page
    this.size = size
  }
}
