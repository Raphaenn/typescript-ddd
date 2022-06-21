import { SignUpControllers } from '../../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/AccountMongoRepository'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { makeSignupValidation } from './signup-validation'

export const makeSingupController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const validations = makeSignupValidation()

  const signUpControllers = new SignUpControllers(dbAddAccount, validations)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpControllers, logMongoRepository)
}
