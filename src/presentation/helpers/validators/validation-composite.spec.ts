// Caso algum validate interno do composite falhar, devemos repassar o erro
// e caso nenhum falar devemos passar adiante sem erro

import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new MissingParamError('field')
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
}

const makeSut = (): SutTypes => {
  const sut = new ValidationComposite([makeValidation()])
  return {
    sut
  }
}

describe('Validation composite', () => {
  test('should return an error if any validations fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
