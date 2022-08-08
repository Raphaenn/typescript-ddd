export class EmailInUseError extends Error {
  constructor () {
    super('The recieve email is already in use')
    this.name = 'EmailInUseError'
  }
}
