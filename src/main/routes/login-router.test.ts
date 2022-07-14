import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helper/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Login Router', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('post/ signup', () => {
    test('should return 200 on signup', async () => {
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

  describe('post/ login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('321993', 12)
      await accountCollection.insertOne({
        name: 'Raphael Neves',
        email: 'raphaelnn@hotmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'raphaelnn@hotmail.com',
          password: '321993'
        })
        .expect(200)
    })
    test('should return 401 on login error', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'raphaelnn@hotmail.com',
          password: '321993'
        })
        .expect(401)
    })
  })
})
