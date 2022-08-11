import env from '../../../config/env'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { JwtAdpter } from '../../../../infra/criptography/jwt-adpter/jwt-adapter'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { Authenticate } from 'domain/usercases'

export const makeDbAuthentication = (): Authenticate => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdpter = new JwtAdpter(env.jwtSecret)

  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdpter, accountMongoRepository)
}
