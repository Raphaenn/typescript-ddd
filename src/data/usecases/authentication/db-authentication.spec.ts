import { AccountModel } from '../add-account/db-add-accounts-protocols'
import { DbAuthentication } from './db-authentication'
import { Authenticate, AuthenticationModel, HashComparer, LoadAccountByEmailRepository, TokenGenerator, UpdateAccessTokenRepository } from './db-authentication-protocols'

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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string | null> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: Authenticate
  loadAccountByEmailRpositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRpositoryStub = makeLoAdAccountByEmailRpository()
  const hashCompareStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRpositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRpositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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

  test('should throw if hashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = sut.auth(makeFakeValidateEmail())
    await expect(auth).rejects.toThrow()
  })

  test('should return null if hashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const auth = await sut.auth(makeFakeValidateEmail())
    expect(auth).toBeNull()
  })

  test('should calls TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generatorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAddAccount())
    expect(generatorSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = sut.auth(makeFakeValidateEmail())
    await expect(auth).rejects.toThrow()
  })

  test('should return a token if TokenGenerator returns true', async () => {
    const { sut } = makeSut()
    const auth = await sut.auth(makeFakeValidateEmail())
    expect(auth).toBe('any_token')
  })

  test('should call updateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const update = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeValidateEmail())
    expect(update).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should throw if updateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const auth = sut.auth(makeFakeValidateEmail())
    await expect(auth).rejects.toThrow()
  })
})
