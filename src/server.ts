import { App } from '@/app'
import { CommonController } from '@/controllers/common.controller'
import { UserController } from '@/controllers/user.controller'
import { AuthController } from './controllers/auth.controllers'

const app = new App([CommonController, UserController, AuthController])

app.listen()
