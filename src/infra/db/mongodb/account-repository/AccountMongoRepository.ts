import { AccountModel } from 'domain/models/account'
import { AddAccountModel } from 'domain/usercases/add-account'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const collection = await accountCollection.findOne(insertedId)
    return MongoHelper.map(collection)
  }
}
