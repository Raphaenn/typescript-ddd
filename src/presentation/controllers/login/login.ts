import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authenticate } from './login-protocols'
import { InvalidParamError } from '../../errors/invalid-param-error'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authenticate: Authenticate

  constructor (emailValidator: EmailValidator, authenticate: Authenticate) {
    this.emailValidator = emailValidator
    this.authenticate = authenticate
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authenticate.auth(email, password)
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
