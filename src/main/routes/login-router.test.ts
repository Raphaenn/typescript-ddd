import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'

describe('Login Router', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('post/ signup', () => {
    test('should return 200 on success', async () => {
      await request(app)
        .post('/api/signUp')
        .send({
          name: 'Raphael Neves',
          email: 'raphaelnn@hotmail.com',
          password: '321993',
          passwordConfirmation: '321993'
        })
        .expect(200)
    })
  })

  describe('post/ signIn', () => {
    test('should return an account on success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Raphael Neves',
          email: 'raphaelnn@hotmail.com',
          password: '321993',
          passwordConfirmation: '321993'
        })
        .expect(200)
    })
  })
})
