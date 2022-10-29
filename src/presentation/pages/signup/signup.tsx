import React, { useState } from 'react'
import { Input, Footer, FormStatus, LoginHeader } from '@/presentation/components'
import Styles from './signup-styles.scss'
import Context from '@/presentation/components/context/form/form-context'
// import { Link } from 'react-router-dom'
const SignUp: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    nameError: 'Campo obrigatório',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: ''
  })
  return (
    <div className={Styles.signup}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} >
          <h2>Criar conta</h2>
          <Input data-testid="name" type="text" name="name" placeholder='Digite seu nome' />
          <Input data-testid="email" type="email" name="email" placeholder='Digite seu e-mail' />
          <Input data-testid="password" type="password" name="password" placeholder='Digite sua senha' />
          <Input data-testid="passwordConfirmation" type="password" name="passwordConfirmation" placeholder='Repita sua senha' />
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
