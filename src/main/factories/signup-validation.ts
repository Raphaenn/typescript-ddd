import { Validation } from 'presentation/helpers/validators'
import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []
  const emailValidator = new EmailValidatorAdapter()

  for (const fields of ['name', 'email', 'password', 'passwordConfirmation']) {
    requiredFields.push(new RequiredFieldValidation(fields))
  }
  requiredFields.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  requiredFields.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(requiredFields)
}
