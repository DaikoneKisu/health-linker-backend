import { App } from '@/app'
import { CommonController } from '@/controllers/common.controller'
import { UserController } from '@/controllers/user.controller'
import { AuthController } from '@/controllers/auth.controllers'
import { AdminController } from '@/controllers/admin.controller'

const app = new App([CommonController, UserController, AuthController, AdminController])

app.listen()
