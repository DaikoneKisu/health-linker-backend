import { IsString, Length } from 'class-validator'

export class CreateChatRoomDto {
  @Length(1, 100, {
    message: 'El nombre de la sala debe tener entre $constraint1 y $constraint2 caracteres.'
  })
  @IsString()
  public roomName: string

  @Length(10, 10, {
    message: 'La longitud del documento de identidad es de $constraint1 caracteres'
  })
  @IsString()
  public ownerDocument: string

  constructor(roomName: string, ownerDocument: string) {
    this.roomName = roomName
    this.ownerDocument = ownerDocument
  }
}
