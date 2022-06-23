import { AuthenticationModel } from '../../../domain/usercases'
import { AccountModel } from '../add-account/db-add-accounts-protocols'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeValidateEmail = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAddAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@email.com',
  name: 'any_name',
  password: 'any_password'
})

const makeLoAdAccountByEmailRpository = (): any => {
  class LoadAccountByEmailStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel | null> {
      return await new Promise(resolve => resolve(makeFakeAddAccount()))
    }
  }
  return new LoadAccountByEmailStub()
}

interface SutTypes {
  sut: any
  loadAccountByEmailRpositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRpositoryStub = makeLoAdAccountByEmailRpository()
  const sut = new DbAuthentication(loadAccountByEmailRpositoryStub)

  return {
    sut,
    loadAccountByEmailRpositoryStub
  }
}

describe('DbAuthentication account', () => {
  test('should call LoadAccountByEmailRepository with correct values', () => {
    const { sut, loadAccountByEmailRpositoryStub } = makeSut()
    const authSpy = jest.spyOn(loadAccountByEmailRpositoryStub, 'load')
    sut.auth(makeFakeValidateEmail())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRpositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRpositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = sut.auth(makeFakeValidateEmail())
    await expect(auth).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRpositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRpositoryStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const auth = await sut.auth(makeFakeValidateEmail())
    expect(auth).toBeNull()
  })
})
