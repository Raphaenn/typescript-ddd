import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-accounts-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository
  private readonly loadAccountByEmailRpository: LoadAccountByEmailRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository, loadAccountByEmailRpository: LoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRpository = loadAccountByEmailRpository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const getAccount = await this.loadAccountByEmailRpository.loadAccessToken(accountData.email)

    if (!getAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password)

      // ! coloco o {} dentro do object assign para garantir que não modifico o objeto original
      // ! crio um objeto novo e copio o accountData
      const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
      return account
    }
    return null
  }
}
