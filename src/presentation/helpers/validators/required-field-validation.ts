import { MissingParamError } from '../../errors/missing-param-error'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  private readonly field: string

  constructor (field: string) {
    this.field = field
  }

  public validate (input: any): Error | undefined {
    const hasField = input[this.field]

    if (!hasField) {
      return new MissingParamError(this.field)
    }
  }
}
