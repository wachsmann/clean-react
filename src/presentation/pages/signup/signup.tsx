import React from 'react'
import { Input, Footer, FormStatus, LoginHeader } from '@/presentation/components'
import Styles from './signup-styles.scss'
import Context from '@/presentation/components/context/form/form-context'
import { Link } from 'react-router-dom'
const SignUp: React.FC = () => {
  return (
    <div className={Styles.signup}>
      <LoginHeader />
      <Context.Provider value={{ state: {} }}>
        <form className={Styles.form} >
          <h2>Criar conta</h2>
          <Input type="text" name="nome" placeholder='Digite seu nome' />
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senha' />
          <Input type="password" name="passwordConfirmation" placeholder='Repita sua senha' />
          <button type='submit' >Entrar</button>
          <Link to={'/login'} className={Styles.link}>Login</Link>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}
export default SignUp
