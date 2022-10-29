import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import SignUp from './signup'
import { Helper } from '@/presentation/test'
type SutTypes = {
  sut: RenderResult
}
const makeSut = (): SutTypes => {
  const sut = render(
    <SignUp />
  )
  return {
    sut
  }
}

describe('SignUp Component', () => {
  test('should start with initial state ', () => {
    const { sut } = makeSut()
    const validationError = 'Campo obrigatório'
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', validationError)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })
})