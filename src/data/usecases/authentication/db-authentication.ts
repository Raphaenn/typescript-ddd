import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-repository'
import { HashComparer } from '../../protocols/criptography/comparer'
import { Authenticate, AuthenticationModel } from '../../../domain/usercases/authenticate'

export class DbAuthentication implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authentication: AuthenticationModel): Promise<any> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password)
    }

    return null
  }
}
