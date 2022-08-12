import { Validation } from 'validation/validators'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []
  const emailValidator = new EmailValidatorAdapter()

  for (const fields of ['email', 'password']) {
    requiredFields.push(new RequiredFieldValidation(fields))
  }
  requiredFields.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(requiredFields)
}
