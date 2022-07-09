import { LogControllerDecorator } from '@main/decorators'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { makeLoginValidation } from './login-validation-factory'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt-adapter'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)

  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, )

  const validations = makeLoginValidation()

  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(dbAuthentication, validations)

  return new LogControllerDecorator(loginController, logMongoRepository)
}
