import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock } from '@/presentation/test'
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
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  waitFor(callback).catch((err) => console.log(err))
}
const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}
const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, { target: { value: password } })
}
const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo!')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}
const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}
const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element).toBeTruthy()
}
const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}
const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('should start with initial state ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    testButtonIsDisabled(sut, 'submit', true)
    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
  })
  test('should show email error if validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populateEmailField(sut)
    testStatusForField(sut, 'email', validationError)
  })
  test('should show password error if validation fails ', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populatePasswordField(sut)
    testStatusForField(sut, 'password', validationError)
  })
  test('should show valid password state if validation succeeds ', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    testStatusForField(sut, 'password')
  })
  test('should show valid email state if validation succeeds ', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    testStatusForField(sut, 'email')
  })
  test('should enable submit button if form is valid ', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, () => {
      testErrorWrapChildCount(sut, 0)
      testButtonIsDisabled(sut, 'submit', false)
    })
  })
  test('should show load spinner on submit ', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut, undefined, undefined, () => {
      simulateValidSubmit(sut, undefined, undefined, () => {
        testElementExists(sut, 'spinner')
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
      testErrorWrapChildCount(sut, 1)
      testElementText(sut, 'main-error', error.message)
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
      testErrorWrapChildCount(sut, 1)
      testElementText(sut, 'main-error', error.message)
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
