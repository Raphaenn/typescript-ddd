export interface authenticationModel {
  email: string
  password: string
}

export interface Authenticate {
  auth: (authentication: authenticationModel) => Promise<any>
}
