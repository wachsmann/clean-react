import React from 'react'
import { Login } from '@/presentation/pages/index'
import { makeRemoteAuthentication } from '@/main/factory/usecases/authentication/remote-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'
import { makeLocalSaveAccessToken } from '@/main/factory/usecases/save-access-token/local-save-access-token-factory'
export const makeLogin: React.FC = () => {
  return (<Login
    authentication={makeRemoteAuthentication()}
    validation={makeLoginValidation()}
    saveAccessToken={makeLocalSaveAccessToken()}
  />)
}
