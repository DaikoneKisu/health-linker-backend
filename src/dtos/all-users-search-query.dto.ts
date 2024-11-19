import { IsOptional, IsString } from 'class-validator'

export class AllUsersSearchQuery {
  @IsString()
  @IsOptional()
  public query?: string

  constructor(query?: string) {
    this.query = query
  }
}
