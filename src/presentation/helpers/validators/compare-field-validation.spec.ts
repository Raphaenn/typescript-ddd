import { InvalidParamError } from '../../errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-field-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Required fields validation', () => {
  test('should return InvalidParamError if compare fields fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return if validation succeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_name',
      fieldToCompare: 'any_name'
    })
    expect(error).toBeFalsy()
  })
})
