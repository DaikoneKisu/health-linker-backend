import { NextFunction, Request, Response } from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import { whitelistedRoutes } from '@/config/whitelisted-routes'
import { AuthService } from '@/services/auth.service'
import { UserService } from '@/services/user.service'
import { EncryptService } from '@/services/encrypt.service'
import { SpecialistService } from '@/services/specialist.service'
import { RuralProfessionalService } from '@/services/rural-professional.service'
import { UserRepository } from '@/repositories/user.repository'
import { AdminRepository } from '@/repositories/admin.repository'
import { RuralProfessionalRepository } from '@/repositories/rural-professional.repository'
import { SpecialistRepository } from '@/repositories/specialist.repository'
import { SpecialtyRepository } from '@/repositories/specialty.repository'

@Middleware({ type: 'before' })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  private readonly _authService: AuthService = new AuthService(
    new UserService(new UserRepository(), new EncryptService(), new AdminRepository()),
    new EncryptService(),
    new RuralProfessionalService(
      new RuralProfessionalRepository(),
      new UserService(new UserRepository(), new EncryptService(), new AdminRepository())
    ),
    new SpecialistService(
      new SpecialistRepository(),
      new UserService(new UserRepository(), new EncryptService(), new AdminRepository()),
      new SpecialtyRepository()
    )
  )

  use(req: Request, res: Response, next: NextFunction): void {
    if (whitelistedRoutes.some((routeRegExp) => routeRegExp.test(req.path))) {
      return next()
    }

    if (this._authService.verify(req.headers.authorization)) {
      return next()
    }

    res.status(401).send({
      error: 'Debes estar autenticado para acceder a esta ruta.',
      reason:
        'El token de autenticación puede estar vencido, no ser usable para la fecha actual o ser inválido.'
    })
    return
  }
}
