import { Validation } from 'presentation/helpers/validators'
import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation } from '../../presentation/helpers/validators'

export const makeSignupValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []

  for (const fields of ['name', 'email', 'password', 'passwordConfirmation']) {
    requiredFields.push(new RequiredFieldValidation(fields))
  }
  requiredFields.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  return new ValidationComposite(requiredFields)
}
