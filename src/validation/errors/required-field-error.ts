export class RequiredFieldError extends Error {
  constructor (_value: string) {
    super('Campo obrigatório!')
    this.name = 'RequiredFieldError'
  }
}
