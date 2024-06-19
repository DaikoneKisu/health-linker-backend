import { IsNumber, IsPositive } from 'class-validator'

export class PositiveNumericIdDto {
  @IsPositive()
  @IsNumber()
  public id: number

  constructor(id: number) {
    this.id = id
  }
}
