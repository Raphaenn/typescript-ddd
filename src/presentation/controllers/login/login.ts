import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { InvalidParamError } from '../../errors/invalid-param-error'
import { Authenticate } from '../../../domain/usercases/authenticate'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidatorAdapter
  private readonly authenticate: Authenticate

  constructor (emailValidator: EmailValidatorAdapter, authenticate: Authenticate) {
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

      const authResponse = await this.authenticate.auth(email, password)
      return await new Promise(resolve => resolve({
        statusCode: 200,
        body: authResponse
      }))
    } catch (error: any) {
      return serverError(error)
    }
  }
}
