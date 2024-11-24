import { IsString, Length } from 'class-validator'

export class CreateChatRoomDto {
  @Length(1, 100, {
    message: 'El nombre de la sala debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public roomName: string

  constructor(roomName: string) {
    this.roomName = roomName
  }
}
