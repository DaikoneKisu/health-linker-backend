import { Action } from 'routing-controllers'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'

export function currentUser(userService: UserService, authService: AuthService) {
  return async (action: Action) => {
    const {
      headers: { authorization: token }
    } = action.request as { headers: { authorization: string } }

    const user = authService.verify(token)

    if (!user) {
      return
    }

    const userInDb = await userService.getUser(user.document)

    if (!userInDb) {
      return
    }

    return userInDb
  }
}
