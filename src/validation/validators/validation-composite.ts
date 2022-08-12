import { Validation } from '../../presentation/protocols/validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  public validate (input: any): Error | undefined {
    for (const validation of this.validations) {
      const validationError = validation.validate(input)

      if (validationError) {
        return validationError
      }
    }
  }
}
