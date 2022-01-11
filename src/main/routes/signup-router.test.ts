import request from 'supertest'
import app from '../config/app'

describe('SignUp Router', () => {
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
