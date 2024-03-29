/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adaptes/express-routes-adapter'
import { makeSingupController } from '../factories/controllers/signup/signup-factory'
import { makeLoginController } from '../factories/controllers/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSingupController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
