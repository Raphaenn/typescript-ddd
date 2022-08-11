import { SignUpControllers } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeSignupValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory.ts'
import { makeDbAddaccountFactory } from '../../usecases/add-account/add-dbAccount-factory'
import { makeLogControllerDecorator } from '../../usecases/decorators/log-controller-decorator-factory'

export const makeSingupController = (): Controller => {
  const signUpControllers = new SignUpControllers(makeDbAddaccountFactory(), makeSignupValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(signUpControllers)
}
