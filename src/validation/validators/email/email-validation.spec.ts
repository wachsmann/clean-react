import { InvalidFieldError } from '@/validation/errors/invalid-field-error'
import faker from '@faker-js/faker'
import { EmailValidation } from './email-validation'
describe('EmailValidation', () => {
  test('should return error if email is invalid', () => {
    const sut = new EmailValidation('email')
    const error = sut.validate(faker.database.column())
    expect(error).toEqual(new InvalidFieldError())
  })
})
