import { Action } from 'routing-controllers'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { AdminService } from '@/services/admin.service'
import { FindUser } from '@/types/find-user.type'
import { FindAdmin } from '@/types/admin.type'

export function currentUser(
  userService: UserService,
  authService: AuthService,
  adminService: AdminService
) {
  return async (
    action: Action
  ): Promise<Omit<FindUser, 'lastOnline'> | Omit<FindAdmin, 'lastOnline'> | undefined> => {
    const {
      headers: { authorization: token }
    } = action.request as { headers: { authorization: string } }

    const user = authService.verify(token)

    if (!user) {
      return
    }

    if ('document' in user) {
      return await userService.getUser(user.document)
    } else {
      return await adminService.getAdmin(user.email)
    }
  }
}
