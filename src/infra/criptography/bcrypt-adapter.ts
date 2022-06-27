import brcypt from 'bcrypt'
import { Hasher, HashComparer } from '../../data/protocols/criptography'

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hash = await brcypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const hashCompare = await brcypt.compare(value, hash)
    return hashCompare
  }
}
