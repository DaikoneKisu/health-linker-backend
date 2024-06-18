import { Action } from 'routing-controllers'
import { Role } from '@/types/role'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

export function authorization(userService: UserService, authService: AuthService) {
  return async (action: Action, roles: Role[]) => {
    const {
      headers: { authorization: token }
    } = action.request as { headers: { authorization: string } }

    const user = authService.verify(token)

    if (!user) {
      return false
    }

    const userInDb = await userService.getUser(user.document)

    if (!userInDb) {
      return false
    }

    if (!roles.includes(userInDb.userType)) {
      return false
    }

    return true
  }
}
