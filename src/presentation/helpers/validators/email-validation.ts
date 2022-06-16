import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  private readonly field: string
  private readonly emailValidator: EmailValidator

  constructor (field: string, emailValidator: EmailValidator) {
    this.field = field
    this.emailValidator = emailValidator
  }

  public validate (input: any): Error | undefined {
    const isValid = this.emailValidator.isValid(input[this.field])
    if (!isValid) {
      return new InvalidParamError('email')
    }
  }
}
