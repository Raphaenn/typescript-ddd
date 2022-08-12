import { Validation } from 'validation/validators'
import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

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
