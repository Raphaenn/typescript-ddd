import { AccountModel } from '../../../domain/models/account'

export interface LoadAccountByEmailRepository {
  loadAccessToken: (email: string) => Promise<AccountModel | null>
}
