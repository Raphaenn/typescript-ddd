import { MissingParamError } from '../../errors/missing-param-error'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required fields validation', () => {
  test('should return MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const validated = sut.validate({ name: 'wrong_field' })
    expect(validated).toEqual(new MissingParamError('field'))
  })
})
