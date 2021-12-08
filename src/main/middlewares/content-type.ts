import { Request, Response, NextFunction } from 'express'

export const content = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  next()
}
