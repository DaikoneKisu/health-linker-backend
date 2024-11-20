import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationService {
  public async sendSms(to: string, message: string): Promise<void> {
    console.log(`Simulated SMS sent to ${to}: ${message}`)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return Promise.resolve()
  }
}
