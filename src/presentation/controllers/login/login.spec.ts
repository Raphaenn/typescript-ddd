import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helpers'
import { LoginController } from './login'
import { HttpRequest } from '../signup/signup-protocols'
import { Authenticate, AuthenticationModel } from '../../../domain/usercases/authenticate'
import { Validation } from '../../helpers/validators'
import { MissingParamError } from '../../errors'

interface Sutypes {
  sut: LoginController
  authenticateStub: Authenticate
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): any {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthenticate = (): Authenticate => {
  class AuthenticateStub implements Authenticate {
    async auth (authentication: AuthenticationModel): Promise<any> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticateStub()
}

const makeSut = (): Sutypes => {
  const authenticateStub = makeAuthenticate()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticateStub, validationStub)
  return {
    sut,
    authenticateStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation return an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call authenticate with correct value', async () => {
    const { sut, authenticateStub } = makeSut()
    const authSpy = jest.spyOn(authenticateStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toBeCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticateStub } = makeSut()
    jest.spyOn(authenticateStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticateStub } = makeSut()
    jest.spyOn(authenticateStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
