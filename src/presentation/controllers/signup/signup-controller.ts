import { HttpRequest, HttpResponse, Controller } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helpers'
import { AddAccount } from '../../../domain/usercases/add-account'
import { Validation } from '../../protocols/validation'
import { Authenticate } from '../login/login-controller-protocols'

export class SignUpControllers implements Controller {
  private readonly addAccount: AddAccount
  private readonly valitation: Validation
  private readonly authentication: Authenticate

  constructor (addAccount: AddAccount, valitation: Validation, authentication: Authenticate) {
    this.addAccount = addAccount
    this.valitation = valitation
    this.authentication = authentication
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

      await this.authentication.auth({
        email,
        password
      })
      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
