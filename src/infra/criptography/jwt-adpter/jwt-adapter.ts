import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptography'

export class JwtAdpter implements Encrypter {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string | null> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
