import { IsOptional, IsString } from 'class-validator'

export class EducationalResourceSearchQuery {
  @IsString()
  @IsOptional()
  public query?: string

  constructor(query?: string) {
    this.query = query
  }
}

export class CreateEducationalResourceDto {
  @IsString()
  public title: string

  @IsString()
  public content: string

  constructor(title: string, content: string) {
    this.title = title
    this.content = content
  }
}

export class UpdateEducationalResourceDto {
  @IsString()
  @IsOptional()
  public title?: string

  @IsString()
  @IsOptional()
  public content?: string

  constructor(title?: string, content?: string) {
    this.title = title
    this.content = content
  }
}
