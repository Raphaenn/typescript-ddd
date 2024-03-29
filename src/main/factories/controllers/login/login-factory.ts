import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../presentation/protocols/controller'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory.ts'
import { makeLogControllerDecorator } from '../../..//factories/usecases/decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(loginController)
}
