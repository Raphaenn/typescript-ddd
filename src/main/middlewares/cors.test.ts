import request from 'supertest'
import app from '../config/app'

describe('Cors middleware', () => {
  test('should enable cors', async () => {
    app.post('/test-cors', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
