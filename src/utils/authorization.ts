import { Action } from 'routing-controllers'
import { Role } from '@/types/role'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { AdminService } from '@/services/admin.service'
import { FindAdmin } from '@/types/admin.type'
import { FindUser } from '@/types/find-user.type'

export function authorization(
  userService: UserService,
  authService: AuthService,
  adminService: AdminService
) {
  return async (action: Action, roles: Role[]) => {
    const {
      headers: { authorization: token }
    } = action.request as { headers: { authorization: string } }

    const user = authService.verify(token)

    if (!user) {
      return false
    }

    let userInDb: FindAdmin | FindUser | undefined = undefined
    if ('document' in user) {
      userInDb = await userService.getUser(user.document)
    } else {
      userInDb = await adminService.getAdmin(user.email)
    }

    if (!userInDb) {
      return false
    }

    if ('document' in userInDb) {
      if (!roles.includes(userInDb.userType)) {
        return false
      }
    }

    return true
  }
}
