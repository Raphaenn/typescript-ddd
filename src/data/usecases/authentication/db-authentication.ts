import { LoadAccountByEmailRepository } from '../../../data/protocols/load-account-repository'
import { Authenticate, AuthenticationModel } from '../../../domain/usercases/authenticate'

export class DbAuthentication implements Authenticate {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: AuthenticationModel): Promise<any> {
    await this.loadAccountByEmailRepository.load('any_email@mail.com')
  }
}
