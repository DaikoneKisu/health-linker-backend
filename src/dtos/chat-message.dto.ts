import { IsIn, IsInt, IsPositive, IsString } from 'class-validator'

export class CreateChatMessageDto {
  @IsPositive()
  @IsInt()
  public caseId: number

  @IsString()
  public content: string

  @IsIn(['text', 'image', 'audio'])
  @IsString()
  public messageType: 'text' | 'image' | 'audio'

  constructor(caseId: number, content: string, messageType: 'text' | 'image' | 'audio') {
    this.caseId = caseId
    this.content = content
    this.messageType = messageType
  }
}
