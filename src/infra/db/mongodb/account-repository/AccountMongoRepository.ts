import { AccountModel } from 'domain/models/account'
import { AddAccountModel } from 'domain/usercases/add-account'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const accountId = await accountCollection.insertOne(accountData)
    return MongoHelper.map(accountData, accountId)
  }
}
