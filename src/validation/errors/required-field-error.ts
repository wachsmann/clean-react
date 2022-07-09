export class RequiredFieldError extends Error {
  constructor (value: string) {
    super(value)
    this.name = 'RequiredFieldError'
  }
}
