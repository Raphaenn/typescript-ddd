/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../adaptes/express-routes-adapter'
import { makeSingupController } from '../factories/signup/signup-factory'

export default (router: Router): void => {
  router.post(
    '/signup',
    adaptRoute(makeSingupController())
  )
}
