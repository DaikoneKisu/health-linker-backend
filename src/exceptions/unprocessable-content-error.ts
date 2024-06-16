import { HttpError } from 'routing-controllers'

export class UnprocessableContentError extends HttpError {
  constructor(message: string) {
    super(422, message)
  }

  public toJSON() {
    return {
      message: this.message
    }
  }
}
