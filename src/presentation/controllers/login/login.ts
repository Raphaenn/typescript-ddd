import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../signup/signup-protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { InvalidParamError } from '../../errors/invalid-param-error'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidatorAdapter

  constructor (emailValidator: EmailValidatorAdapter) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
    return await new Promise(resolve => resolve({
      statusCode: 200,
      body: null
    }))
  }
}
