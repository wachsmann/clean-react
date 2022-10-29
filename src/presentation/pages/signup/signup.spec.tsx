import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import SignUp from './signup'
import { Helper, ValidationStub, AddAccountSpy } from '@/presentation/test'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
}
type SutParams = {
  validationError: string
}
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const sut = render(
    <SignUp validation={validationStub} addAccount={addAccountSpy} />
  )
  return {
    sut,
    addAccountSpy
  }
}
const simulateValidSubmit = (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password(), callback): void => {
  Helper.populateField(sut, 'name', name)
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  Helper.populateField(sut, 'passwordConfirmation', password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  waitFor(callback).catch((err) => console.log(err))
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
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name')
  })
  test('should show valid email state if validation succeeds ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email')
  })
  test('should show valid password state if validation succeeds ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password')
  })
  test('should enable submit button if form is valid ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })
  test('should show load spinner on submit ', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, undefined, () => {
      Helper.testElementExists(sut, 'spinner')
    })
  })
  test('should call AddAccount with correct values ', () => {
    const { sut, addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, name, email, password, () => {
      expect(addAccountSpy.params).toEqual(
        {
          name,
          email,
          password,
          passwordConfirmation: password
        }
      )
    })
  })
  test('should call AddAccount only once ', () => {
    const { sut, addAccountSpy } = makeSut()
    simulateValidSubmit(sut, undefined, undefined,undefined, () => {
      simulateValidSubmit(sut, undefined, undefined,undefined, () => {
        expect(addAccountSpy.callsCount).toBe(1)
      })
    })
  })
  test('should not call AddAccount if form is invalid ', () => {
    const validationError = faker.random.words()
    const { sut, addAccountSpy } = makeSut({ validationError })

    simulateValidSubmit(sut, undefined, undefined, undefined, () => {
      expect(addAccountSpy.callsCount).toBe(0)
    })
  })
})
