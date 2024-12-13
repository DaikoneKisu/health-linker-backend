import { AdminRepository } from '@/repositories/admin.repository'
import { ChatMessageRepository } from '@/repositories/chat-message.repository'
import { ClinicalCaseFeedbackRepository } from '@/repositories/clinical-case-feedback.repository'
import { ClinicalCaseRepository } from '@/repositories/clinical-case.repository'
import { SpecialistMentorsClinicalCaseRepository } from '@/repositories/specialist-mentors-clinical-case.repository'
import { UserRepository } from '@/repositories/user.repository'
import { EncryptService } from '@/services/encrypt.service'
import { NotificationsService } from '@/services/notifications.service'
import { FindAdmin } from '@/types/admin.type'
import { FindUser } from '@/types/find-user.type'
import { CurrentUser, Get, HttpCode, JsonController, Post } from 'routing-controllers'

@JsonController('/notifications')
export class NotificationsController {
  private readonly _notificationsService = new NotificationsService(
    new UserRepository(),
    new AdminRepository(new EncryptService()),
    new ClinicalCaseFeedbackRepository(),
    new ChatMessageRepository(),
    new SpecialistMentorsClinicalCaseRepository(),
    new ClinicalCaseRepository()
  )

  @HttpCode(204)
  @Post('/last-online')
  public updateLastOnline(@CurrentUser() user: FindUser | FindAdmin) {
    if ('document' in user) {
      return this._notificationsService.updateLastOnlineUser(user.document)
    } else {
      return this._notificationsService.updateLastOnlineAdmin(user.email)
    }
  }

  @HttpCode(200)
  @Get('/')
  public getNotifications(@CurrentUser() user: FindUser | FindAdmin) {
    if ('document' in user) {
      if (user.userType === 'rural professional') {
        return this._notificationsService.getNotificationsRural(user.document)
      } else {
        return this._notificationsService.getNotificationsSpecialist(user.document)
      }
    } else {
      return this._notificationsService.getNotificationsAdmin(user.email)
    }
  }
}
