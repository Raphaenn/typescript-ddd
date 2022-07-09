import jwt from 'jsonwebtoken'
import { JwtAdpter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

describe('JWT Token', () => {
  test('should call signin with correct values', async () => {
    const sut = new JwtAdpter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })

  test('should return a token on signin success', async () => {
    const sut = new JwtAdpter('secret')
    const accessToken = await sut.encrypt('any_value')
    expect(accessToken).toBe('any_token')
  })

  test('should throw if signin throws', async () => {
    const sut = new JwtAdpter('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
