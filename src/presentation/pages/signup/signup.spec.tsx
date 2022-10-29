import React from 'react'
import { cleanup, render, RenderResult } from '@testing-library/react'
import SignUp from './signup'
import { Helper, ValidationStub } from '@/presentation/test'
import faker from '@faker-js/faker'
type SutTypes = {
  sut: RenderResult
}
type SutParams = {
  validationError: string
}
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError

  const sut = render(
    <SignUp validation={validationStub} />
  )
  return {
    sut
  }
}

describe('SignUp Component', () => {
  afterEach(cleanup)
  test('should start with initial state ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testChildCount(sut, 'error-wrap', 0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', validationError)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })
  test('should show name error if Validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name', validationError)
  })
  test('should show email error if Validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email', validationError)
  })
  test('should show password error if Validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password', validationError)
  })
  test('should show passwordConfirmation error if Validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })
  test('should show valid name state if validation succeeds ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut,'name')
    Helper.testStatusForField(sut, 'name')
  })
  test('should show valid email state if validation succeeds ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut,'email')
    Helper.testStatusForField(sut, 'email')
  })
  test('should show valid password state if validation succeeds ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut,'password')
    Helper.testStatusForField(sut, 'password')
  })
  test('should enable submit button if form is valid ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut,'name')
    Helper.populateField(sut,'email')
    Helper.populateField(sut,'password')
    Helper.populateField(sut,'passwordConfirmation')
    Helper.testButtonIsDisabled(sut,'submit',false)
  })
})
