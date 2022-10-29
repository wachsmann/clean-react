import React, { useEffect, useState } from 'react'
import { Input, Footer, FormStatus, LoginHeader } from '@/presentation/components'
import Styles from './signup-styles.scss'
import Context from '@/presentation/components/context/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
// import { Link } from 'react-router-dom'
type Props = {
  validation: Validation
}
const SignUp: React.FC<Props> = ({ validation }) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    mainError: ''
  })
  useEffect(() => {
    setState({
      ...state,
      ...{
        nameError: validation.validate('name', state.name),
        emailError: validation.validate('email', state.email),
        passwordError: validation.validate('password', state.password),
        passwordConfirmationError: validation.validate('password', state.passwordConfirmation)
      }
    })
  }, [state.name,state.email, state.password,state.passwordConfirmation])
  return (
    <div className={Styles.signup}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} >
          <h2>Criar conta</h2>
          <Input type="text" name="name" placeholder='Digite seu nome' />
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senha' />
          <Input type="password" name="passwordConfirmation" placeholder='Repita sua senha' />
          <button data-testid="submit" disabled type='submit' >Entrar</button>
          {/* <span to={'/login'} className={Styles.link}>Login</span> */}
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}
export default SignUp
