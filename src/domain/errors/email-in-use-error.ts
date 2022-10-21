export class EmailInUseError extends Error {
  constructor () {
    super('E-mail em uso!')
    this.name = 'EmailInUseError'
  }
}
