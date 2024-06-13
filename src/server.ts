import { App } from '@/app'
import { CommonController } from '@/controllers/common.controller'
import { UserController } from '@/controllers/user.controller'

const app = new App([CommonController, UserController])

app.listen()
