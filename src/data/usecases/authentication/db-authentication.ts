import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../protocols/db'
import { HashComparer, TokenGenerator } from '../../protocols/criptography'
import { Authenticate, AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<any> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        if (accessToken) await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }

    return null
  }
}
