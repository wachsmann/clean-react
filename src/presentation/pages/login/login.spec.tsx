import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock, Helper } from '@/presentation/test'
import faker from '@faker-js/faker'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}
type SutParams = {
  validationError: string
}
const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return {
    sut,
    saveAccessTokenMock,
    authenticationSpy
  }
}
const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password(), callback): void => {
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  waitFor(callback).catch((err) => console.log(err))
}
describe('Login Component', () => {
  afterEach(cleanup)

  test('should start with initial state ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
  })
  test('should show email error if validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut,'email')
    Helper.testStatusForField(sut, 'email', validationError)
  })
  test('should show password error if validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut,'password')
    Helper.testStatusForField(sut, 'password', validationError)
  })
  test('should show valid password state if validation succeeds ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut,'password')
    Helper.testStatusForField(sut, 'password')
  })
  test('should show valid email state if validation succeeds ', () => {
    const { sut } = makeSut()
    Helper.populateField(sut,'email')
    Helper.testStatusForField(sut, 'email')
  })
  test('should enable submit button if form is valid ', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, () => {
      Helper.testChildCount(sut, 'error-wrap', 0)
      Helper.testButtonIsDisabled(sut, 'submit', false)
    })
  })
  test('should show load spinner on submit ', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, () => {
      simulateValidSubmit(sut, undefined, undefined, () => {
        Helper.testElementExists(sut, 'spinner')
      })
    })
  })
  test('should call Authentication with correct values ', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(sut, email, password, () => {
      expect(authenticationSpy.params).toEqual({ email, password })
    })
  })
  test('should call Authentication only once ', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, () => {
      simulateValidSubmit(sut, undefined, undefined, () => {
        expect(authenticationSpy.callsCount).toBe(1)
      })
    })
  })
  test('should not call Authentication if form is invalid ', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })

    simulateValidSubmit(sut, undefined, undefined, () => {
      expect(authenticationSpy.callsCount).toBe(0)
    })
  })
  test('should present error if Authentication fails', () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    simulateValidSubmit(sut, undefined, undefined, () => {
      Helper.testChildCount(sut, 'error-wrap', 1)
      Helper.testElementText(sut, 'main-error', error.message)
    })
  })
  test('should call SaveAccessToken on success', () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, () => {
      expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
      expect(history.length).toBe(1)
      expect(history.location.pathname).toBe('/')
    })
  })
  test('should present error if SaveAccessToken fails', () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))
    simulateValidSubmit(sut, undefined, undefined, () => {
      Helper.testChildCount(sut, 'error-wrap', 1)
      Helper.testElementText(sut, 'main-error', error.message)
    })
  })
  test('should go to signup page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
