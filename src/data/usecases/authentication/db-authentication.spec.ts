import { Authenticate, AuthenticationModel } from '../../../domain/usercases'
import { AccountModel } from '../add-account/db-add-accounts-protocols'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-repository'
import { DbAuthentication } from './db-authentication'
import { HashComparer } from '../../protocols/criptography/comparer'

const makeFakeValidateEmail = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAddAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@email.com',
  name: 'any_name',
  password: 'hashed_password'
})

const makeLoAdAccountByEmailRpository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel | null> {
      return await new Promise(resolve => resolve(makeFakeAddAccount()))
    }
  }
  return new LoadAccountByEmailStub()
}

const makeHashComparer = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashCompareStub()
}

interface SutTypes {
  sut: Authenticate
  loadAccountByEmailRpositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRpositoryStub = makeLoAdAccountByEmailRpository()
  const hashCompareStub = makeHashComparer()
  const sut = new DbAuthentication(loadAccountByEmailRpositoryStub, hashCompareStub)

  return {
    sut,
    loadAccountByEmailRpositoryStub,
    hashCompareStub
  }
}

describe('DbAuthentication account', () => {
  test('should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRpositoryStub } = makeSut()
    const authSpy = jest.spyOn(loadAccountByEmailRpositoryStub, 'load')
    await sut.auth(makeFakeValidateEmail())
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

  test('should call hashCompare with correct password', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeValidateEmail())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
})
