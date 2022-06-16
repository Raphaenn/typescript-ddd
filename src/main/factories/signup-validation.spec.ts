import { Validation, RequiredFieldValidation, CompareFieldsValidation, ValidationComposite } from '../../presentation/helpers/validators'
import { makeSignupValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUp Validation factory', () => {
  test('should call validatoin composite with all validations', () => {
    makeSignupValidation()

    const validations: Validation[] = []
    const fields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of fields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
