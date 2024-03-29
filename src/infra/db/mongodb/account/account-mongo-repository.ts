import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from 'data/protocols/db'
import { AccountModel } from 'domain/models/account'
import { AddAccountModel } from 'domain/usercases/add-account'
import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const collection = await accountCollection.findOne(insertedId)
    return MongoHelper.map(collection)
  }

  async loadAccessToken (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: any, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        accessToken: token
      }
    })
  }
}
