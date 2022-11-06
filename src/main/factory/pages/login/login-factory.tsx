import React from 'react'
import { Login } from '@/presentation/pages/index'
import { makeLoginValidation } from './login-validation-factory'
import { makeLocalSaveAccessToken } from '@/main/factory/usecases/save-access-token/local-save-access-token-factory'
import { makeRemoteAuthentication } from '../../usecases/add-account/remote-authentication-factory'
export const makeLogin: React.FC = () => {
  return (<Login
    authentication={makeRemoteAuthentication()}
    validation={makeLoginValidation()}
    saveAccessToken={makeLocalSaveAccessToken()}
  />)
}
