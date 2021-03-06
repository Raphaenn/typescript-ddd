import { HttpRequest, HttpResponse, Controller } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helpers'
import { AddAccount } from '../../../domain/usercases/add-account'
import { Validation } from '../../protocols/validation'

export class SignUpControllers implements Controller {
  private readonly addAccount: AddAccount
  private readonly valitation: Validation

  constructor (addAccount: AddAccount, valitation: Validation) {
    this.addAccount = addAccount
    this.valitation = valitation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.valitation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body
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
