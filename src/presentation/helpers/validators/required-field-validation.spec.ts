import { MissingParamError } from '../../errors/missing-param-error'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('Required fields validation', () => {
  test('should return MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'wrong_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return if validation succeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
