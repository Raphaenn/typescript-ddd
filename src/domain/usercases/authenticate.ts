export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authenticate {
  auth: (authentication: AuthenticationModel) => Promise<any>
}
