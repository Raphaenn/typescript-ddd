import { SignUpControllers } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/AccountMongoRepository'
import { Controller } from 'presentation/protocols'
import { LogControllerDecorator } from '../decorators'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'

export const makeSingupController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const signUpControllers = new SignUpControllers(emailValidatorAdapter, dbAddAccount)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpControllers, logMongoRepository)
}
