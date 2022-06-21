import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse, Authenticate, Validation } from './login-protocols'

export class LoginController implements Controller {
  private readonly authenticate: Authenticate
  private readonly validation: Validation

  constructor (authenticate: Authenticate, validation: Validation) {
    this.authenticate = authenticate
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }

      const accessToken = await this.authenticate.auth(email, password)
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
