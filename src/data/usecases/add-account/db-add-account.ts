import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-accounts-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    // coloco o {} dentro do object assign para garantir que não modifico o objeto original
    // crio um objeto novo e copio o accountData
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise(resolve => resolve(null))
  }
}
