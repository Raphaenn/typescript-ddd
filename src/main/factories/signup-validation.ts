import { Validation } from 'presentation/helpers/validators'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignupValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []

  for (const fields of ['name', 'email', 'password', 'passwordConfirmation']) {
    requiredFields.push(new RequiredFieldValidation(fields))
  }
  return new ValidationComposite(requiredFields)
}
