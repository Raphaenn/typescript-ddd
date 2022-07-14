import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators'
import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../presentation/protocols/controller'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { JwtAdpter } from '../../../infra/criptography/jwt-adpter/jwt-adapter'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt-adapter'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdpter = new JwtAdpter(env.jwtSecret)

  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdpter, accountMongoRepository)
  const validations = makeLoginValidation()
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(dbAuthentication, validations)

  return new LogControllerDecorator(loginController, logMongoRepository)
}
