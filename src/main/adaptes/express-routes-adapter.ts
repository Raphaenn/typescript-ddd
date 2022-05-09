import { Controller, HttpRequest } from 'presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const htppResponse = await controller.handle(httpRequest)
    return res.status(htppResponse.statusCode).json(htppResponse.body)
  }
}
