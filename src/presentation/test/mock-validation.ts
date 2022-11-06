import { Validation } from '@/presentation/protocols/validation'

export class ValidationStub implements Validation {
  errorMessage: string
  validate(_fieldName: string, _input: object): string {
    return this.errorMessage
  }
}
