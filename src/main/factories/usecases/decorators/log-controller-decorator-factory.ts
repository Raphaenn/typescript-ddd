import { Controller } from '../../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../../decorators'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-repository'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
