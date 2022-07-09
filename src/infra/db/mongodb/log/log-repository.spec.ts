import { Collection } from 'mongodb'
import { LogMongoRepository } from './log-repository'
import { MongoHelper } from '../helper/mongo-helper'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Mongodb Logs ', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('should add a log with throws error', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
