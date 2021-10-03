import { HttpRequest, HttpResponse, Controller, EmailValidator } from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { badRequest } from '../../helpers/http-helpers'
import { AddAccount } from 'domain/usercases/add-account'

export class SignUpControllers implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 200,
        body: this.addAccount.add({
          name,
          email,
          password
        })
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
