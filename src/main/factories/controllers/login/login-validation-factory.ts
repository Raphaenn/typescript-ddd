import { Validation } from 'presentation/helpers/validators'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []
  const emailValidator = new EmailValidatorAdapter()

  for (const fields of ['email', 'password']) {
    requiredFields.push(new RequiredFieldValidation(fields))
  }
  requiredFields.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(requiredFields)
}
