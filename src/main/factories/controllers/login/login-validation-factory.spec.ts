import { EmailValidator } from '../../../../validation/protocols'
import { Validation, RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../../validation/validators'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidate = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation factory', () => {
  test('should call validatoin composite with all validations', () => {
    makeLoginValidation()

    const validations: Validation[] = []
    const fields = ['email', 'password']

    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidate()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
