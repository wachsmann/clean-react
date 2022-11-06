import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@/presentation/components'
import '@/presentation/styles/globals.scss'
import { makeLogin } from './factory/pages/login/login-factory'
import { makeSignUp } from './factory/pages/signup/login-factory'

ReactDOM.render(
  <Router
    makeLogin={makeLogin}
    makeSignUp={makeSignUp}
  />,
  document.getElementById('main')
)
