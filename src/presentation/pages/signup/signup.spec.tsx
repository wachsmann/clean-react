import React from 'react'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import SignUp from './signup'
import { Helper, ValidationStub, AddAccountSpy, SaveAccessTokenMock } from '@/presentation/test'
import faker from '@faker-js/faker'
import { EmailInUseError } from '@/domain/errors'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  saveAccessTokenMock: SaveAccessTokenMock
}
type SutParams = {
  validationError: string
}
const history = createMemoryHistory({ initialEntries: ['/signup'] })

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <Router history={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return {
    sut,
    addAccountSpy,
    saveAccessTokenMock
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
    simulateValidSubmit(sut, undefined, undefined, undefined, () => {
      simulateValidSubmit(sut, undefined, undefined, undefined, () => {
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
  test('should present error if AddAccount fails', () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    simulateValidSubmit(sut, undefined, undefined, undefined, () => {
      Helper.testElementText(sut, 'main-error', error.message)
      Helper.testChildCount(sut, 'error-wrap', 1)
    })
  })
  test('should call SaveAccessToken on success', () => {
    const { sut, addAccountSpy, saveAccessTokenMock } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, undefined, () => {
      expect(saveAccessTokenMock.accessToken).toBe(addAccountSpy.account.accessToken)
      expect(history.length).toBe(1)
      expect(history.location.pathname).toBe('/')
    })
  })

  test('should present error if SaveAccessToken fails', () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error)
    simulateValidSubmit(sut, undefined, undefined, undefined, () => {
      Helper.testChildCount(sut, 'error-wrap', 1)
      Helper.testElementText(sut, 'main-error', error.message)
    })
  })
})
