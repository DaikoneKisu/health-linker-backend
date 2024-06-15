import { App } from '@/app'
import { CommonController } from '@/controllers/common.controller'
import { UserController } from '@/controllers/user.controller'
import { AuthController } from '@/controllers/auth.controllers'
import { AdminController } from '@/controllers/admin.controller'
import { RuralProfessionalController } from './controllers/rural-professional.controller'
import { SpeacialtyController } from './controllers/specialty.controller'

const app = new App([
  CommonController,
  UserController,
  AuthController,
  AdminController,
  RuralProfessionalController,
  SpeacialtyController
])

app.listen()
