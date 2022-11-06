import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Buider } from '@/validation/validators/builder/validation-builder'
import { makeSignUpValidation } from './signup-validation-factory'

describe('SignUpValidationFactory', () => {
  test('should make ValidationComposite with correct validation', () => {
    const composite = makeSignUpValidation()
    expect(composite).toEqual(ValidationComposite.build([
      ...Buider.field('name').required().minLength(5).build(),
      ...Buider.field('email').required().email().build(),
      ...Buider.field('password').required().minLength(5).build(),
      ...Buider.field('passwordConfirmation').required().sameAs('password').build()
    ]))
  })
})
