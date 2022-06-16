import { HttpRequest, HttpResponse, Controller, EmailValidator } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'
import { AddAccount } from '../../../domain/usercases/add-account'
import { Validation } from '../../helpers/validators/validation'

export class SignUpControllers implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly valitation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, valitation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.valitation = valitation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const error = this.valitation.validate(httpRequest.body)

      if (error) badRequest(error)

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
