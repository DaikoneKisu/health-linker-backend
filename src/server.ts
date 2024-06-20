import { App } from '@/app'
import { CommonController } from '@/controllers/common.controller'
import { UserController } from '@/controllers/user.controller'
import { AuthController } from '@/controllers/auth.controllers'
import { AdminController } from '@/controllers/admin.controller'
import { RuralProfessionalController } from './controllers/rural-professional.controller'
import { SpecialtyController } from './controllers/specialty.controller'
import { SpecialistController } from './controllers/specialist.controller'
import { ClinicalCaseController } from './controllers/clinical-case.controller'
import { SpecialistMentorsClinicalCaseController } from './controllers/specialist-mentors-clinical-case.controller'
import { authorization } from './utils/authorization'
import { currentUser } from './utils/current-user'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { SpecialistService } from '@/services/specialist.service'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { ClinicalCaseFeedbackController } from './controllers/clinical-case-feedback.controller'

const encryptService = new EncryptService()

const userService = new UserService(new UserRepository(), encryptService, new AdminRepository())

const authService: AuthService = new AuthService(
  userService,
  encryptService,
  new RuralProfessionalService(new RuralProfessionalRepository(), userService),
  new SpecialistService(new SpecialistRepository(), userService, new SpecialtyRepository())
)

const app = new App(
  [
    CommonController,
    UserController,
    AuthController,
    AdminController,
    RuralProfessionalController,
    SpecialtyController,
    SpecialistController,
    ClinicalCaseController,
    SpecialistMentorsClinicalCaseController,
    ClinicalCaseFeedbackController
  ],
  authorization(userService, authService),
  currentUser(userService, authService)
)

app.listen()
