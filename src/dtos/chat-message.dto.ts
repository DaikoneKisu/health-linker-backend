import { IsIn, IsInt, IsPositive, IsString } from 'class-validator'

export class CreateChatMessageDto {
  @IsPositive()
  @IsInt()
  public roomId: number

  @IsString()
  public content: string

  @IsIn(['text', 'image', 'audio'])
  @IsString()
  public messageType: 'text' | 'image' | 'audio'

  constructor(roomId: number, content: string, messageType: 'text' | 'image' | 'audio') {
    this.roomId = roomId
    this.content = content
    this.messageType = messageType
  }
}
