import { EmailValidator } from '../../../../presentation/protocols/emailValidator'
import { Validation, RequiredFieldValidation, CompareFieldsValidation, ValidationComposite, EmailValidation } from '../../../../presentation/helpers/validators'
import { makeSignupValidation } from './signup-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const makeEmailValidate = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUp Validation factory', () => {
  test('should call validatoin composite with all validations', () => {
    makeSignupValidation()

    const validations: Validation[] = []
    const fields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidate()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
